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

type ChangeHandler = ({
  type: ConnectionType,
  effectiveType: EffectiveConnectionType,
}) => void;

type IsConnectedHandler = (isConnected: boolean) => void;

const _subscriptions = new Map();

function _isConnected(connection) {
  return connection.type !== 'none' && connection.type !== 'unknown';
}

const _isConnectedSubscriptions = new Map();

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
    let listener;
    if (eventName === 'connectionChange') {
      listener = NetInfoEventEmitter.addListener(
        DEVICE_CONNECTIVITY_EVENT,
        appStateData => {
          handler({
            type: appStateData.connectionType,
            effectiveType: appStateData.effectiveConnectionType,
          });
        },
      );
    } else {
      console.warn('Trying to subscribe to unknown event: "' + eventName + '"');
      return {
        remove: () => {},
      };
    }

    _subscriptions.set(handler, listener);
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
    const listener = _subscriptions.get(handler);
    if (!listener) {
      return;
    }
    listener.remove();
    _subscriptions.delete(handler);
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
