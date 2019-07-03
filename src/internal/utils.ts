/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as PrivateTypes from './privateTypes';
import * as Types from './types';
import InternetReachability from './internetReachability';
import NativeInterface from './nativeInterface';

export function convertState(
  input: PrivateTypes.NetInfoNativeModuleState,
): Types.NetInfoState {
  if (typeof input.isInternetReachable === 'boolean') {
    return input as Types.NetInfoState;
  } else {
    return {
      ...input,
      isInternetReachable: InternetReachability.currentState(),
    } as Types.NetInfoState;
  }
}

export function currentState(): Promise<PrivateTypes.NetInfoNativeModuleState> {
  return NativeInterface.getCurrentState();
}

export default {
  convertState,
  currentState,
};
