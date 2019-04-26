/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Subscriptions from './internal/subscriptions';
import * as Types from './internal/types';
import NativeInterface from './internal/nativeInterface';

export function fetch(): Promise<Types.NetInfoState> {
  return NativeInterface.getCurrentState();
}

export function addEventListener(
  handler: Types.NetInfoChangeHandler,
): Types.NetInfoSubscription {
  Subscriptions.add(handler);
  return (): void => {
    Subscriptions.remove(handler);
  };
}

export * from './internal/types';

export default {
  fetch,
  addEventListener,
};
