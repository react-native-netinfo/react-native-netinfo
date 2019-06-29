/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import State from './state';
import * as DeprecatedTypes from './deprecatedTypes';
import * as Types from './types';
import DeprecatedUtils from './deprecatedUtils';

let _isSetup = false;
const _subscriptions = new Set<DeprecatedTypes.ChangeHandler>();
let _latestState: DeprecatedTypes.NetInfoData | null = null;

function _handler(state: Types.NetInfoState): void {
  const convertedState = DeprecatedUtils.convertState(state);
  _latestState = convertedState;
  _subscriptions.forEach((handler): void => handler(convertedState));
}

export function setup(): void {
  // Skip if we are already setup
  if (_isSetup) {
    return;
  }

  State.add(_handler);
}

export function tearDown(): void {
  // Skip if we are not setup
  if (!_isSetup) {
    return;
  }

  State.remove(_handler);
  _latestState = null;
  _subscriptions.clear();
}

export function latest(): Promise<DeprecatedTypes.NetInfoData> {
  if (_latestState) {
    return Promise.resolve(_latestState);
  } else {
    return State.latest().then(
      (state): DeprecatedTypes.NetInfoData => {
        _latestState = DeprecatedUtils.convertState(state);
        return _latestState;
      },
    );
  }
}

export function add(handler: DeprecatedTypes.ChangeHandler): void {
  // Add the subscription handler to our set
  _subscriptions.add(handler);

  // Send the latest state we have on listen
  if (_latestState) {
    handler(_latestState);
  } else {
    latest().then(handler);
  }
}

export function remove(handler: DeprecatedTypes.ChangeHandler): void {
  _subscriptions.delete(handler);
}

export default {
  setup,
  tearDown,
  latest,
  add,
  remove,
};
