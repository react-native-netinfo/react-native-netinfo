/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

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

export default {
  convertState,
};
