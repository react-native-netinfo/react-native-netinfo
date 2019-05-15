/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export const StateType = {
  unknown: 'unknown',
  none: 'none',
  cellular: 'cellular',
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  ethernet: 'ethernet',
  wimax: 'wimax',
};
export type NetInfoStateType =
  | 'unknown'
  | 'none'
  | 'cellular'
  | 'wifi'
  | 'bluetooth'
  | 'ethernet'
  | 'wimax';

export const CellularGeneration = {
  '2g': '2g',
  '3g': '3g',
  '4g': '4g',
};
export type NetInfoCellularGeneration = '2g' | '3g' | '4g';

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
}

interface NetInfoConnectedState<T extends string, D extends object = {}> {
  type: T;
  isConnected: true;
  details: D & NetInfoConnectedDetails;
}

interface NetInfoDisconnectedState<T extends string> {
  type: T;
  isConnected: false;
  details: null;
}

export type NetInfoUnknownState = NetInfoDisconnectedState<'unknown'>;
export type NetInfoNoConnectionState = NetInfoDisconnectedState<'none'>;
export type NetInfoCellularState = NetInfoConnectedState<
  'cellular',
  {
    cellularGeneration: NetInfoCellularGeneration | null;
  }
>;
export type NetInfoWifiState = NetInfoConnectedState<'wifi'>;
export type NetInfoBluetoothState = NetInfoConnectedState<'bluetooth'>;
export type NetInfoEthernetState = NetInfoConnectedState<'ethernet'>;
export type NetInfoWimaxState = NetInfoConnectedState<'wimax'>;

export type NetInfoState =
  | NetInfoUnknownState
  | NetInfoNoConnectionState
  | NetInfoCellularState
  | NetInfoWifiState
  | NetInfoBluetoothState
  | NetInfoEthernetState
  | NetInfoWimaxState;

export type NetInfoChangeHandler = (state: NetInfoState) => void;
export type NetInfoSubscription = () => void;
