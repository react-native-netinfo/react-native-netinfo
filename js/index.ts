/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import DeprecatedUtils from './internal/deprecatedUtils';
import DeprecatedSubscriptions from './internal/deprecatedSubscriptions';
import * as DeprecatedTypes from './internal/deprecatedTypes';
import Subscriptions from './internal/subscriptions';
import * as Types from './internal/types';
import NativeInterface from './internal/nativeInterface';

export function fetch(): Promise<Types.NetInfoState> {
  return NativeInterface.getCurrentState();
}

export function addEventListener(
  handlerOrType: Types.NetInfoChangeHandler,
): Types.NetInfoSubscription;
export function addEventListener(
  handlerOrType: string,
  deprecatedHandler: DeprecatedTypes.ChangeHandler
): DeprecatedTypes.Subscription;
export function addEventListener(
  handlerOrType: Types.NetInfoChangeHandler | string,
  deprecatedHandler: DeprecatedTypes.ChangeHandler | undefined = undefined,
): Types.NetInfoSubscription | DeprecatedTypes.Subscription {
  if (typeof handlerOrType === 'string') {
    if (handlerOrType === "connectionChange" && deprecatedHandler) {
      DeprecatedSubscriptions.add(deprecatedHandler);
      return {
        remove: () => {
          DeprecatedSubscriptions.remove(deprecatedHandler);
        }
      }
    } else {
      return {
        remove: () => {}
      }
    }
  } else {
    const handler = handlerOrType;
    Subscriptions.add(handler);
    return (): void => {
      Subscriptions.remove(handler);
    };
  }
}

export function removeEventListener(
  type: string,
  handler: DeprecatedTypes.ChangeHandler,
): void {
  if (type === "connectionChange") {
    DeprecatedSubscriptions.remove(handler);
  }
}

export function getConnectionInfo(): Promise<DeprecatedTypes.NetInfoData> {
  return NativeInterface.getCurrentState().then(DeprecatedUtils.convertState);
}

export function isConnectionExpensive(): Promise<boolean> {
  return NativeInterface.getCurrentState().then(DeprecatedUtils.isConnectionExpensive);
}

export * from './internal/types';

export default {
  fetch,
  addEventListener,
  removeEventListener,
  getConnectionInfo,
  isConnectionExpensive
};
