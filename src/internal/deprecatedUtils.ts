/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Platform} from 'react-native';
import * as DeprecatedTypes from './deprecatedTypes';
import * as Types from './types';

/**
 * Convert the NetInfoState to the deprecated NetInfoData type.
 *
 * @param input The current NetInfoState to convert.
 */
export function convertState(
  input: Types.NetInfoState,
): DeprecatedTypes.NetInfoData {
  let effectiveType: DeprecatedTypes.NetInfoEffectiveType = 'unknown';
  if (input.type === 'cellular') {
    effectiveType = input.details.cellularGeneration || 'unknown';
  }

  // Ensure we don't sent types that the old meethods did not support. Set them to "unknown"
  const type: DeprecatedTypes.NetInfoType =
    input.type === Types.NetInfoStateType.vpn ||
    input.type === Types.NetInfoStateType.other
      ? 'unknown'
      : input.type;

  return {
    type,
    effectiveType,
  };
}

/**
 * Decide the the given NetInfoState describes an expensive connection.
 *
 * @param input The current NetInfoState to decide if the connection is expensive.
 */
export function isConnectionExpensive(input: Types.NetInfoState): boolean {
  if (Platform.OS === 'android') {
    if (
      input.type !== Types.NetInfoStateType.none &&
      input.type !== Types.NetInfoStateType.unknown
    ) {
      return input.details.isConnectionExpensive;
    } else {
      return false;
    }
  } else {
    throw new Error('Currently not supported on iOS');
  }
}

/**
 * Decide the the given NetInfoState describes an active connection.
 *
 * @param input The current NetInfoState to decide if the connection is active.
 */
export function isConnected(input: Types.NetInfoState): boolean {
  return input.isConnected;
}

/**
 * Prints a warning message once per session.
 */
let warned = false;
export function warnOnce(): void {
  if (warned) {
    return;
  }

  console.warn(
    'Warning: RNCNetInfo - You are using the deprecated API. It will still work, but you must upgrade to the new API to receive the new features. The old API will be removed in the future',
  );
  warned = true;
}

export default {
  convertState,
  isConnectionExpensive,
  isConnected,
  warnOnce,
};
