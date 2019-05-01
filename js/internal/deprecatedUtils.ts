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

  return {
    type: input.type,
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
    if (input.type !== 'none' && input.type !== 'unknown') {
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
 *
 * @param key The key used to ensure the message is printed once.
 *            This should be unique to the callsite.
 * @param message The message to print.
 */
const warnedKeys: {[string: string]: boolean} = {};
export function warnOnce(key: string, message: string): void {
  if (warnedKeys[key]) {
    return;
  }

  console.warn(message);
  warnedKeys[key] = true;
}

export default {
  convertState,
  isConnectionExpensive,
  isConnected,
  warnOnce,
};
