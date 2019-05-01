/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export type NetInfoStateType =
  | 'unknown'
  | 'none'
  | 'cellular'
  | 'wifi'
  | 'bluetooth'
  | 'ethernet'
  | 'wimax';

export type NetInfoCellularGeneration = '2g' | '3g' | '4g';

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
}

export interface NetInfoUnknownState {
  type: 'unknown';
  isConnected: false;
  details: null;
}

export interface NetInfoNoConnectionState {
  type: 'none';
  isConnected: false;
  details: null;
}

export interface NetInfoCellularState {
  type: 'cellular';
  isConnected: true;
  details: NetInfoConnectedDetails & {
    cellularGeneration: NetInfoCellularGeneration | null;
  };
}

export interface NetInfoWifiState {
  type: 'wifi';
  isConnected: true;
  details: NetInfoConnectedDetails;
}

export interface NetInfoBluetoothState {
  type: 'bluetooth';
  isConnected: true;
  details: NetInfoConnectedDetails;
}

export interface NetInfoEthernetState {
  type: 'ethernet';
  isConnected: true;
  details: NetInfoConnectedDetails;
}

export interface NetInfoWimaxState {
  type: 'wimax';
  isConnected: true;
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
