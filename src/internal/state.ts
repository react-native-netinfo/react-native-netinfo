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
import Utils from './utils';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

let _isSetup = false;
let _nativeEventSubscription: NativeEventSubscription | null = null;
let _internetReachabilitySubscription: (() => void) | null = null;
const _subscriptions = new Set<Types.NetInfoChangeHandler>();
let _latestState: Types.NetInfoState | null = null;

function fetchCurrentState(): Promise<Types.NetInfoState> {
  return Utils.currentState().then(
    (state): Types.NetInfoState => {
      // Update the internet reachability module
      InternetReachability.update(state);

      // Convert and store the new state
      const convertedState = Utils.convertState(state);
      _latestState = convertedState;
      return convertedState;
    },
  );
}

export function setup(): void {
  // Skip if we are already setup
  if (_isSetup) {
    return;
  }

  // Add the subscription to the natvie events
  _nativeEventSubscription = NativeInterface.eventEmitter.addListener(
    DEVICE_CONNECTIVITY_EVENT,
    (state): void => {
      // Update the internet reachability module
      InternetReachability.update(state);

      // Convert the state from native to JS shape
      const convertedState = Utils.convertState(state);

      // Update the listeners
      _latestState = convertedState;
      _subscriptions.forEach((handler): void => handler(convertedState));
    },
  );

  // Fetch the current state from the native module
  fetchCurrentState();

  // Add the listener to the internet connectivity events
  _internetReachabilitySubscription = InternetReachability.addSubscription(
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

  // We are are now setup
  _isSetup = true;
}

export function tearDown(): void {
  // Skip if we are not setup
  if (!_isSetup) {
    return;
  }

  if (_nativeEventSubscription) {
    _nativeEventSubscription.remove();
  }
  _subscriptions.clear();
  InternetReachability.clear();
  if (_internetReachabilitySubscription) {
    _internetReachabilitySubscription();
  }

  // We are are no longer setup
  _isSetup = false;
}

export function latest(): Promise<Types.NetInfoState> {
  if (_latestState) {
    return Promise.resolve(_latestState);
  } else {
    return fetchCurrentState();
  }
}

export function add(handler: Types.NetInfoChangeHandler): void {
  // Add the subscription handler to our set
  _subscriptions.add(handler);

  // Send it the latest data we have
  if (_latestState) {
    handler(_latestState);
  } else {
    latest().then(handler);
  }
}

export function remove(handler: Types.NetInfoChangeHandler): void {
  _subscriptions.delete(handler);
}

export default {
  setup,
  tearDown,
  latest,
  add,
  remove,
};
