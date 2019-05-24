/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeEventSubscription} from 'react-native';
import NativeInterface from './nativeInterface';
import * as Types from './types';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

const _subscriptions = new Set<Types.NetInfoChangeHandler>();
let _latestState: Types.NetInfoState | null = null;

let _nativeEventSubscription: NativeEventSubscription | null = null;

function _listenerHandler(state: Types.NetInfoState): void {
  _latestState = state;
  _subscriptions.forEach((handler): void => handler(state));
}

export function add(
  handler: Types.NetInfoChangeHandler,
  latestOnListen: boolean = true,
): void {
  // Add the subscription handler to our set
  _subscriptions.add(handler);

  // Send it the latest data we have
  if (latestOnListen) {
    if (_latestState) {
      handler(_latestState);
    } else {
      NativeInterface.getCurrentState().then(
        (state): void => {
          _latestState = state;
          handler(_latestState);
        },
      );
    }
  }

  // Subscribe to native events, if we aren't already
  if (_subscriptions.size > 0 && !_nativeEventSubscription) {
    _nativeEventSubscription = NativeInterface.eventEmitter.addListener(
      DEVICE_CONNECTIVITY_EVENT,
      _listenerHandler,
    );
  }
}

export function remove(handler: Types.NetInfoChangeHandler): void {
  _subscriptions.delete(handler);

  if (_subscriptions.size === 0 && _nativeEventSubscription) {
    _nativeEventSubscription.remove();
    _nativeEventSubscription = null;
  }
}

export function clear(): void {
  _subscriptions.clear();

  if (_nativeEventSubscription) {
    _nativeEventSubscription.remove();
    _nativeEventSubscription = null;
  }
}

export default {
  add,
  remove,
  clear,
};
