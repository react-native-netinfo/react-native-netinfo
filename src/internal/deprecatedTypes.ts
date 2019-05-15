/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export type NetInfoType =
  // iOS & Android
  | 'none'
  | 'cellular'
  | 'unknown'
  | 'wifi'
  // Android only
  | 'bluetooth'
  | 'ethernet'
  | 'wimax';

export type NetInfoEffectiveType = 'unknown' | '2g' | '3g' | '4g';

export interface NetInfoData {
  type: NetInfoType;
  effectiveType: NetInfoEffectiveType;
}

export const CHANGE_EVENT_NAME = 'connectionChange';
export type ChangeEventName = 'connectionChange';

export type ChangeHandler = (data: NetInfoData) => void;
export type IsConnectedHandler = (isConnected: boolean) => void;

export interface Subscription {
  remove(): void;
}

export interface NativeInterface {
  getCurrentConnectivity: () => Promise<NetInfoData>;
  isConnectionMetered: () => Promise<boolean>;
}
