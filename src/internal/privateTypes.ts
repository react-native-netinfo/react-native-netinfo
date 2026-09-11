/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NetInfoConfiguration, NetInfoState} from './types';

export const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

// Certain properties are optional when sent by the native module and are handled by the JS code
export type NetInfoNativeModuleState = Pick<
  NetInfoState,
  Exclude<keyof NetInfoState, 'isInternetReachable'>
> & {isInternetReachable?: boolean};

export interface NetInfoNativeModule {
  configure: (config: Partial<NetInfoConfiguration>) => void;
  getCurrentState: (
    requestedInterface?: string,
  ) => Promise<NetInfoNativeModuleState>;
  addListener(
    eventName: string,
    listener?: (event: NetInfoNativeModuleState) => void,
  ): void;
  removeListeners(
    countOrEventName: number | string,
    listener?: (event: NetInfoNativeModuleState) => void,
  ): void;
}

export type NetInfoInternetReachabilityChangeListener = (
  isInternetReachable: boolean | null | undefined,
) => void;
