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
import type {
  NetInfoData as _NetInfoData,
  NetInfoType as _NetInfoType,
  NetInfoEffectiveType as _NetInfoEffectiveType,
} from './types';

export type NetInfoData = _NetInfoData;
export type NetInfoType = _NetInfoType;
export type NetInfoEffectiveType = _NetInfoEffectiveType;

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';
const CHANGE_EVENT_NAME = 'connectionChange';

type ChangeEventName = 'connectionChange';

type ChangeHandler = (data: NetInfoData) => void;
type IsConnectedHandler = (isConnected: boolean) => void;
// Ideally we would use the EmitterSubscription from react-native, but it is not publicly exported
type Subscription = {remove: () => void};

const _subscriptions = new Set<ChangeHandler>();
const _isConnectedSubscriptions = new Map();
let _latestNetInfo: NetInfoData | null = null;
let _eventSubscription: Subscription | null = null;

function _isConnected(netInfoData: NetInfoData): boolean {
  return netInfoData.type !== 'none' && netInfoData.type !== 'unknown';
}

function _listenerHandler(netInfoData: NetInfoData) {
  _latestNetInfo = netInfoData;
  for (let handler of _subscriptions) {
    handler(_latestNetInfo);
  }
}

/**
 * NetInfo exposes info about online/offline status.
 */
const NetInfo = {
  Events: {
    NetworkStatusDidChange: DEVICE_CONNECTIVITY_EVENT,
  },

  /**
   * Adds an event handler.
   */
  addEventListener(
    eventName: ChangeEventName,
    handler: ChangeHandler,
  ): {remove: () => void} {
    if (eventName !== CHANGE_EVENT_NAME) {
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
      // The EmitterSubscription type is slightly different than the one we use. Ideally we would
      // use it directly, but it is not public.
      // $FlowExpectedError
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
   * Get the current connection info.
   */
  getConnectionInfo(): Promise<NetInfoData> {
    return RNCNetInfo.getCurrentConnectivity();
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
