/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

import {Platform} from 'react-native';
import {RNCNetInfo, NetInfoEventEmitter} from './nativeInterface';

const DEVICE_CONNECTIVITY_EVENT = 'networkStatusDidChange';

type ChangeEventName = 'connectionChange';

export type ConnectionType =
  // iOS & Android
  | 'none'
  | 'cellular'
  | 'unknown'
  | 'wifi'
  // Android only
  | 'bluetooth'
  | 'ethernet'
  | 'wimax';

export type EffectiveConnectionType = 'unknown' | '2g' | '3g' | '4g';

export type NetInfoData = {
  type: ConnectionType,
  effectiveType: EffectiveConnectionType,
};

type ChangeHandler = (data: NetInfoData) => void;

type IsConnectedHandler = (isConnected: boolean) => void;

const _subscriptions = new Set<ChangeHandler>();
const _isConnectedSubscriptions = new Map();

let _latestNetInfo = null;
let _eventSubscription = null;

function _isConnected(connection) {
  return connection.type !== 'none' && connection.type !== 'unknown';
}

function _transformResponse(appStateData) {
  return {
    type: appStateData.connectionType,
    effectiveType: appStateData.effectiveConnectionType,
  };
}

function _listenerHandler(appStateData) {
  _latestNetInfo = _transformResponse(appStateData);
  for (let handler of _subscriptions) {
    handler(_latestNetInfo);
  }
}

/**
 * NetInfo exposes info about online/offline status.
 *
 * See https://facebook.github.io/react-native/docs/netinfo.html
 */
const NetInfo = {
  Events: {
    NetworkStatusDidChange: DEVICE_CONNECTIVITY_EVENT,
  },

  /**
   * Adds an event handler.
   *
   * See https://facebook.github.io/react-native/docs/netinfo.html#addeventlistener
   */
  addEventListener(
    eventName: ChangeEventName,
    handler: ChangeHandler,
  ): {remove: () => void} {
    if (eventName !== 'connectionChange') {
      console.warn('Trying to subscribe to unknown event: "' + eventName + '"');
      return {
        remove: () => {},
      };
    }

    _subscriptions.add(handler);

    if (_latestNetInfo) {
      handler(_latestNetInfo);
    } else {
      NetInfo.getConnectionInfo().then(netInfo => {
        _latestNetInfo = netInfo;
        handler(_latestNetInfo);
      });
    }

    if (_subscriptions.size > 0 && !_eventSubscription) {
      _eventSubscription = NetInfoEventEmitter.addListener(
        DEVICE_CONNECTIVITY_EVENT,
        _listenerHandler,
      );
    }

    return {
      remove: () => NetInfo.removeEventListener(eventName, handler),
    };
  },

  /**
   * Removes the listener for network status changes.
   *
   * See https://facebook.github.io/react-native/docs/netinfo.html#removeeventlistener
   */
  removeEventListener(
    eventName: ChangeEventName,
    handler: ChangeHandler,
  ): void {
    _subscriptions.delete(handler);

    if (_subscriptions.size === 0 && _eventSubscription) {
      _eventSubscription.remove();
      _eventSubscription = null;
    }
  },

  /**
   * See https://facebook.github.io/react-native/docs/netinfo.html#getconnectioninfo
   */
  getConnectionInfo(): Promise<any> {
    return RNCNetInfo.getCurrentConnectivity().then(resp => {
      return {
        type: resp.connectionType,
        effectiveType: resp.effectiveConnectionType,
      };
    });
  },

  /**
   * An object with the same methods as above but the listener receives a
   * boolean which represents the internet connectivity.
   *
   * See https://facebook.github.io/react-native/docs/netinfo.html#isconnected
   */
  isConnected: {
    addEventListener(
      eventName: ChangeEventName,
      handler: IsConnectedHandler,
    ): {remove: () => void} {
      const listener = connection => {
        if (eventName === 'connectionChange') {
          handler(_isConnected(connection));
        }
      };
      _isConnectedSubscriptions.set(handler, listener);
      NetInfo.addEventListener(eventName, listener);
      return {
        remove: () =>
          NetInfo.isConnected.removeEventListener(eventName, handler),
      };
    },

    removeEventListener(
      eventName: ChangeEventName,
      handler: IsConnectedHandler,
    ): void {
      const listener = _isConnectedSubscriptions.get(handler);
      listener && NetInfo.removeEventListener(eventName, listener);
      _isConnectedSubscriptions.delete(handler);
    },

    fetch(): Promise<any> {
      return NetInfo.getConnectionInfo().then(_isConnected);
    },
  },

  isConnectionExpensive(): Promise<boolean> {
    return Platform.OS === 'android'
      ? RNCNetInfo.isConnectionMetered()
      : Promise.reject(new Error('Currently not supported on iOS'));
  },
};

module.exports = NetInfo;
