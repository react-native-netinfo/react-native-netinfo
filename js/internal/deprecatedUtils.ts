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

export function isConnected(input: Types.NetInfoState): boolean {
  return input.isConnected;
}

export default {
  convertState,
  isConnectionExpensive,
  isConnected,
};
