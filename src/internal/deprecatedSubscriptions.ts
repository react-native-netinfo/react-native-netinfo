/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Subscriptions from './subscriptions';
import NativeInterface from './nativeInterface';
import * as DeprecatedTypes from './deprecatedTypes';
import DeprecatedUtils from './deprecatedUtils';
import * as Types from './types';

const _subscriptions = new Set<DeprecatedTypes.ChangeHandler>();
let _latestState: DeprecatedTypes.NetInfoData | null = null;

let _isListening = false;

function _listenerHandler(state: Types.NetInfoState): void {
  const convertedState = DeprecatedUtils.convertState(state);
  _latestState = convertedState;
  _subscriptions.forEach((handler): void => handler(convertedState));
}

export function add(handler: DeprecatedTypes.ChangeHandler): void {
  // Add the subscription handler to our set
  _subscriptions.add(handler);

  // Send it the latest data we have
  if (_latestState) {
    handler(_latestState);
  } else {
    NativeInterface.getCurrentState().then(
      (state): void => {
        _latestState = DeprecatedUtils.convertState(state);
        handler(_latestState);
      },
    );
  }

  // Subscribe to native events, if we aren't already
  if (_subscriptions.size > 0 && !_isListening) {
    Subscriptions.add(_listenerHandler, false);
    _isListening = true;
  }
}

export function remove(handler: DeprecatedTypes.ChangeHandler): void {
  _subscriptions.delete(handler);

  if (_subscriptions.size === 0 && _isListening) {
    Subscriptions.remove(_listenerHandler);
    _isListening = false;
  }
}

export function clear(): void {
  _subscriptions.clear();

  if (_isListening) {
    Subscriptions.remove(_listenerHandler);
    _isListening = false;
  }
}

export default {
  add,
  remove,
  clear,
};
