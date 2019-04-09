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
const CHANGE_EVENT_NAME = 'connectionChange';

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

export type NativeNetInfoData = {
  connectionType: ConnectionType,
  effectiveConnectionType: EffectiveConnectionType,
};

type ChangeHandler = (data: NetInfoData) => void;

type EventHandle = {remove: () => void};

type IsConnectedHandler = (isConnected: boolean) => void;

const _subscriptions = new Set<ChangeHandler>();
const _isConnectedSubscriptions = new Map();

let _latestNetInfo = null;
let _eventSubscription = null;

function _isConnected(connection: NetInfoData): boolean {
  return connection.type !== 'none' && connection.type !== 'unknown';
}

function _transformResponse(appStateData: NativeNetInfoData): NetInfoData {
  return {
    ...appStateData,
    type: appStateData.connectionType,
    effectiveType: appStateData.effectiveConnectionType,
  };
}

function _listenerHandler(appStateData: NativeNetInfoData): void {
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
  ): EventHandle {
    if (eventName !== CHANGE_EVENT_NAME) {
      console.warn(`Trying to subscribe to unknown event: "${eventName}"`);
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
   * Removes all listeners.
   */
  clearEventListeners(): void {
    for (let listener of _subscriptions) {
      NetInfo.removeEventListener(CHANGE_EVENT_NAME, listener);
    }
  },

  /**
   * See https://facebook.github.io/react-native/docs/netinfo.html#getconnectioninfo
   */
  async getConnectionInfo(): Promise<NetInfoData> {
    const connectivity = await RNCNetInfo.getCurrentConnectivity();
    return _transformResponse(connectivity);
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
    ): EventHandle {
      const listener = connection => {
        if (eventName === CHANGE_EVENT_NAME) {
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
      if (listener) {
        NetInfo.removeEventListener(eventName, listener);
      }
      _isConnectedSubscriptions.delete(handler);
    },

    async fetch(): Promise<boolean> {
      const connectionInfo = await NetInfo.getConnectionInfo();
      return _isConnected(connectionInfo);
    },
  },

  isConnectionExpensive(): Promise<boolean> {
    if (!RNCNetInfo.isConnectionMetered) {
      throw new Error(
        `The method NetInfo.isConnectionExpensive is not available on ${
          Platform.OS
        }, are you sure you've linked all the native dependencies properly?`,
      );
    }
    return RNCNetInfo.isConnectionMetered();
  },
};

module.exports = NetInfo;
