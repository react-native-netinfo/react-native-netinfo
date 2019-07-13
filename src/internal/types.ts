/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export enum NetInfoStateType {
  unknown = 'unknown',
  none = 'none',
  cellular = 'cellular',
  wifi = 'wifi',
  bluetooth = 'bluetooth',
  ethernet = 'ethernet',
  wimax = 'wimax',
  vpn = 'vpn',
  other = 'other',
}

export enum NetInfoCellularGeneration {
  '2g' = '2g',
  '3g' = '3g',
  '4g' = '4g',
}

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
}

interface NetInfoConnectedState<
  T extends NetInfoStateType,
  D extends object = {}
> {
  type: T;
  isConnected: true;
  isInternetReachable: boolean | null;
  details: D & NetInfoConnectedDetails;
}

interface NetInfoDisconnectedState<T extends NetInfoStateType> {
  type: T;
  isConnected: false;
  isInternetReachable: false;
  details: null;
}

export type NetInfoUnknownState = NetInfoDisconnectedState<
  NetInfoStateType.unknown
>;
export type NetInfoNoConnectionState = NetInfoDisconnectedState<
  NetInfoStateType.none
>;
export type NetInfoCellularState = NetInfoConnectedState<
  NetInfoStateType.cellular,
  {
    cellularGeneration: NetInfoCellularGeneration | null;
  }
>;
export type NetInfoWifiState = NetInfoConnectedState<NetInfoStateType.wifi>;
export type NetInfoBluetoothState = NetInfoConnectedState<
  NetInfoStateType.bluetooth
>;
export type NetInfoEthernetState = NetInfoConnectedState<
  NetInfoStateType.ethernet
>;
export type NetInfoWimaxState = NetInfoConnectedState<NetInfoStateType.wimax>;
export type NetInfoVpnState = NetInfoConnectedState<NetInfoStateType.vpn>;
export type NetInfoOtherState = NetInfoConnectedState<NetInfoStateType.other>;

export type NetInfoState =
  | NetInfoUnknownState
  | NetInfoNoConnectionState
  | NetInfoCellularState
  | NetInfoWifiState
  | NetInfoBluetoothState
  | NetInfoEthernetState
  | NetInfoWimaxState
  | NetInfoVpnState
  | NetInfoOtherState;

export type NetInfoChangeHandler = (state: NetInfoState) => void;
export type NetInfoSubscription = () => void;
