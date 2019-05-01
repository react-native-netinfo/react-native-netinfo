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

const DEPRECATED_CHANGE_EVENT_NAME = 'connectionChange';

const _isConnectedListeners = new Map<
  DeprecatedTypes.IsConnectedHandler,
  /// @ts-ignore Typescript des not like the trailing comma that Prettier insists upon
  Types.NetInfoChangeHandler
>();

export function fetch(): Promise<Types.NetInfoState> {
  return NativeInterface.getCurrentState();
}

export function addEventListener(
  handlerOrType: Types.NetInfoChangeHandler,
): Types.NetInfoSubscription;
export function addEventListener(
  handlerOrType: string,
  deprecatedHandler: DeprecatedTypes.ChangeHandler,
): DeprecatedTypes.Subscription;
export function addEventListener(
  handlerOrType: Types.NetInfoChangeHandler | string,
  deprecatedHandler: DeprecatedTypes.ChangeHandler | undefined = undefined,
): Types.NetInfoSubscription | DeprecatedTypes.Subscription {
  if (typeof handlerOrType === 'string') {
    DeprecatedUtils.warnOnce();

    if (handlerOrType === DEPRECATED_CHANGE_EVENT_NAME && deprecatedHandler) {
      DeprecatedSubscriptions.add(deprecatedHandler);
      return {
        remove: (): void => {
          DeprecatedSubscriptions.remove(deprecatedHandler);
        },
      };
    } else {
      return {
        remove: (): void => {},
      };
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
  DeprecatedUtils.warnOnce();

  if (type === DEPRECATED_CHANGE_EVENT_NAME) {
    DeprecatedSubscriptions.remove(handler);
  }
}

export function getConnectionInfo(): Promise<DeprecatedTypes.NetInfoData> {
  DeprecatedUtils.warnOnce();
  return NativeInterface.getCurrentState().then(DeprecatedUtils.convertState);
}

export function isConnectionExpensive(): Promise<boolean> {
  return NativeInterface.getCurrentState().then(
    DeprecatedUtils.isConnectionExpensive,
  );
}

export const isConnected = {
  addEventListener: (
    eventName: string,
    handler: DeprecatedTypes.IsConnectedHandler,
  ): DeprecatedTypes.Subscription => {
    if (eventName !== DEPRECATED_CHANGE_EVENT_NAME) {
      return {remove: (): void => {}};
    }

    const listener = (state: Types.NetInfoState): void => {
      handler(DeprecatedUtils.isConnected(state));
    };

    _isConnectedListeners.set(handler, listener);
    Subscriptions.add(listener);

    return {
      remove: (): void => {
        Subscriptions.remove(listener);
      },
    };
  },

  removeEventListener: (
    _eventName: string,
    handler: DeprecatedTypes.IsConnectedHandler,
  ): void => {
    const listener = _isConnectedListeners.get(handler);
    listener && Subscriptions.remove(listener);
    _isConnectedListeners.delete(handler);
  },

  fetch: (): Promise<boolean> => {
    return NativeInterface.getCurrentState().then(DeprecatedUtils.isConnected);
  },
};

export * from './internal/types';
export * from './internal/deprecatedTypes';

export default {
  fetch,
  addEventListener,
  removeEventListener,
  getConnectionInfo,
  isConnectionExpensive,
  isConnected,
};
