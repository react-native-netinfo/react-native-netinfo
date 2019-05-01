/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export type NetInfoCellularGeneration = '2g' | '3g' | '4g';

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
}

export interface NetInfoUnknownState {
  type: 'unknown';
  isConnected: boolean;
  details: null;
}

export interface NetInfoNoConnectionState {
  type: 'none';
  isConnected: boolean;
  details: null;
}

export interface NetInfoCellularState {
  type: 'cellular';
  isConnected: boolean;
  details: NetInfoConnectedDetails & {
    cellularGeneration: NetInfoCellularGeneration | null;
  };
}

export interface NetInfoWifiState {
  type: 'wifi';
  isConnected: boolean;
  details: NetInfoConnectedDetails;
}

export interface NetInfoBluetoothState {
  type: 'bluetooth';
  isConnected: boolean;
  details: NetInfoConnectedDetails;
}

export interface NetInfoEthernetState {
  type: 'ethernet';
  isConnected: boolean;
  details: NetInfoConnectedDetails;
}

export interface NetInfoWimaxState {
  type: 'wimax';
  isConnected: boolean;
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
