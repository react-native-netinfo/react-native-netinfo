/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
  externalIp: string | null;
  externalIpv6: string | null;
}

export interface NetInfoUnknownState {
  type: 'unknown';
  isConnected: false;
  isInternetReachable: false;
  details: null;
}

export interface NetInfoNoConnectionState {
  type: 'none';
  isConnected: false;
  isInternetReachable: false;
  details: null;
}

export interface NetInfoCellularState {
  type: 'cellular';
  isConnected: true;
  isInternetReachable: boolean;
  details: NetInfoConnectedDetails & {
    cellularGeneration: '2g' | '3g' | '4g' | null,
  };
}

export interface NetInfoWifiState {
  type: 'wifi';
  isConnected: true;
  isInternetReachable: boolean;
  details: NetInfoConnectedDetails & {
    ssid: string | null,
  };
}

export interface NetInfoBluetoothState {
  type: 'bluetooth';
  isConnected: true;
  isInternetReachable: boolean;
  details: NetInfoConnectedDetails;
}

export interface NetInfoEthernetState {
  type: 'ethernet';
  isConnected: true;
  isInternetReachable: boolean;
  details: NetInfoConnectedDetails;
}

export interface NetInfoWimaxState {
  type: 'wimax';
  isConnected: true;
  isInternetReachable: boolean;
  details: NetInfoConnectedDetails;
}

export type NetInfoChangeHandler = (state: NetInfoState) => void;
export type NetInfoSubscription = () => void;

export type NetInfoState =
  | NetInfoUnknownState
  | NetInfoNoConnectionState
  | NetInfoCellularState
  | NetInfoWifiState
  | NetInfoBluetoothState
  | NetInfoEthernetState
  | NetInfoWimaxState;
