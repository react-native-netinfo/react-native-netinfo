/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
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

export type NetInfoData = {
  type: NetInfoType,
  effectiveType: NetInfoEffectiveType,
};

export type NativeInterface = {
  getCurrentConnectivity: () => Promise<NetInfoData>,
  isConnectionMetered: () => Promise<boolean>,
  // For the NativeEventEmitter
  +addListener: (eventType: string) => void,
  +removeListeners: (count: number) => void,
};
