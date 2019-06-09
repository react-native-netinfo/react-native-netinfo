/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NetInfoState} from './types';

// Certain properties are optional when sent by the native module and are handled by the JS code
export type NetInfoNativeModuleState = Pick<
  NetInfoState,
  Exclude<keyof NetInfoState, 'isInternetReachable'>
> & {isInternetReachable?: boolean};

export interface NetInfoNativeModule {
  getCurrentState: () => Promise<NetInfoNativeModuleState>;
  addListener: (type: string, handler: Function) => void;
  removeListeners: (type: string, handler: Function) => void;
}

export type NetInfoInternetReachabilityChangeListener = (
  isInternetReachable: boolean | null,
) => void;
