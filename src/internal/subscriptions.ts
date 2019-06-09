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
import InternetReachability from './internetReachability';
import * as Types from './types';
import * as PrivateTypes from './privateTypes';
import Utils from './utils';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

const _subscriptions = new Set<Types.NetInfoChangeHandler>();
let _latestState: Types.NetInfoState | null = null;

let _nativeEventSubscription: NativeEventSubscription | null = null;

function _listenerHandler(state: PrivateTypes.NetInfoNativeModuleState): void {
  // Update the internet reachability module
  InternetReachability.update(state);

  // Convert the state from native to JS shape
  const convertedState = Utils.convertState(state);

  // Update the listeners
  _latestState = convertedState;
  _subscriptions.forEach((handler): void => handler(convertedState));
}

InternetReachability.addSubscription(
  (isInternetReachable): void => {
    if (!_latestState) {
      return;
    }

    const nextState = {
      ..._latestState,
      isInternetReachable,
    } as Types.NetInfoState;
    _latestState = nextState;
    _subscriptions.forEach((handler): void => handler(nextState));
  },
);

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
      Utils.currentState().then(
        (state): void => {
          _latestState = state;
          handler(state);
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

  InternetReachability.clear();
}

export default {
  add,
  remove,
  clear,
};
