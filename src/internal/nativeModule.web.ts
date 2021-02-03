/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  NetInfoNativeModule,
  DEVICE_CONNECTIVITY_EVENT,
  NetInfoNativeModuleState,
} from './privateTypes';
import {
  NetInfoState,
  NetInfoStateType,
  NetInfoUnknownState,
  NetInfoNoConnectionState,
  NetInfoCellularState,
  NetInfoBluetoothState,
  NetInfoEthernetState,
  NetInfoWifiState,
  NetInfoWimaxState,
  NetInfoOtherState,
  NetInfoCellularGeneration,
} from './types';

// See https://wicg.github.io/netinfo/#dom-connectiontype
type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'mixed'
  | 'none'
  | 'other'
  | 'unknown'
  | 'wifi'
  | 'wimax';

// See https://wicg.github.io/netinfo/#dom-effectiveconnectiontype
type ConnectionEffectiveType = '2g' | '3g' | '4g' | 'slow-2g';

// https://wicg.github.io/netinfo/#dom-networkinformation-savedata
type ConnectionSaveData = boolean;

interface Events {
  change: Event;
}

interface Connection {
  type: ConnectionType;
  effectiveType: ConnectionEffectiveType;
  saveData: ConnectionSaveData;
  addEventListener<K extends keyof Events>(
    type: K,
    listener: (event: Events[K]) => void,
  ): void;
  removeEventListener<K extends keyof Events>(
    type: K,
    listener: (event: Events[K]) => void,
  ): void;
}

// Create (optional) connection APIs on navigator
declare global {
  interface Navigator {
    connection?: Connection;
    mozConnection?: Connection;
    webkitConnection?: Connection;
  }
}

// Check if the browser supports the connection API
const connection =
  window.navigator.connection ||
  window.navigator.mozConnection ||
  window.navigator.webkitConnection;

// Map browser types to native types
const typeMapping: Record<ConnectionType, NetInfoStateType> = {
  bluetooth: NetInfoStateType.bluetooth,
  cellular: NetInfoStateType.cellular,
  ethernet: NetInfoStateType.ethernet,
  none: NetInfoStateType.none,
  other: NetInfoStateType.other,
  unknown: NetInfoStateType.unknown,
  wifi: NetInfoStateType.wifi,
  wimax: NetInfoStateType.wimax,
  mixed: NetInfoStateType.other,
};
const effectiveTypeMapping: Record<
  ConnectionEffectiveType,
  NetInfoCellularGeneration
> = {
  '2g': NetInfoCellularGeneration['2g'],
  '3g': NetInfoCellularGeneration['3g'],
  '4g': NetInfoCellularGeneration['4g'],
  'slow-2g': NetInfoCellularGeneration['2g'],
};

// Determine current state of connection
const getCurrentState = (
  _requestedInterface?: string,
): Pick<NetInfoState, Exclude<keyof NetInfoState, 'isInternetReachable'>> => {
  const isConnected = navigator.onLine;
  const baseState = {
    isInternetReachable: null,
  };

  // If we don't have a connection object, we return minimal information
  if (!connection) {
    if (isConnected) {
      const state: NetInfoOtherState = {
        ...baseState,
        isConnected: true,
        type: NetInfoStateType.other,
        details: {
          isConnectionExpensive: false,
        },
      };
      return state;
    }

    const state: NetInfoNoConnectionState = {
      ...baseState,
      isConnected: false,
      isInternetReachable: false,
      type: NetInfoStateType.none,
      details: null,
    };
    return state;
  }

  // Otherwise try to return detailed information
  const isConnectionExpensive = connection.saveData;
  const type: NetInfoStateType = connection.type
    ? typeMapping[connection.type]
    : isConnected
    ? NetInfoStateType.other
    : NetInfoStateType.unknown;

  if (type === NetInfoStateType.bluetooth) {
    const state: NetInfoBluetoothState = {
      ...baseState,
      isConnected: true,
      type,
      details: {
        isConnectionExpensive,
      },
    };
    return state;
  } else if (type === NetInfoStateType.cellular) {
    const state: NetInfoCellularState = {
      ...baseState,
      isConnected: true,
      type,
      details: {
        isConnectionExpensive,
        cellularGeneration:
          effectiveTypeMapping[connection.effectiveType] || null,
        carrier: null,
      },
    };
    return state;
  } else if (type === NetInfoStateType.ethernet) {
    const state: NetInfoEthernetState = {
      ...baseState,
      isConnected: true,
      type,
      details: {
        isConnectionExpensive,
        ipAddress: null,
        subnet: null,
      },
    };
    return state;
  } else if (type === NetInfoStateType.wifi) {
    const state: NetInfoWifiState = {
      ...baseState,
      isConnected: true,
      type,
      details: {
        isConnectionExpensive,
        ssid: null,
        bssid: null,
        strength: null,
        ipAddress: null,
        subnet: null,
        frequency: null,
      },
    };
    return state;
  } else if (type === NetInfoStateType.wimax) {
    const state: NetInfoWimaxState = {
      ...baseState,
      isConnected: true,
      type,
      details: {
        isConnectionExpensive,
      },
    };
    return state;
  } else if (type === NetInfoStateType.none) {
    const state: NetInfoNoConnectionState = {
      ...baseState,
      isConnected: false,
      isInternetReachable: false,
      type,
      details: null,
    };
    return state;
  } else if (type === NetInfoStateType.unknown) {
    const state: NetInfoUnknownState = {
      ...baseState,
      isConnected: null,
      isInternetReachable: null,
      type,
      details: null,
    };
    return state;
  }

  const state: NetInfoOtherState = {
    ...baseState,
    isConnected: true,
    type: NetInfoStateType.other,
    details: {
      isConnectionExpensive,
    },
  };
  return state;
};

const handlers: ((state: NetInfoNativeModuleState) => void)[] = [];
const nativeHandlers: (() => void)[] = [];

const RNCNetInfo: NetInfoNativeModule = {
  addListener(type, handler): void {
    switch (type) {
      case DEVICE_CONNECTIVITY_EVENT: {
        const nativeHandler = (): void => {
          handler(getCurrentState());
        };

        if (connection) {
          connection.addEventListener('change', nativeHandler);
        } else {
          window.addEventListener('online', nativeHandler, false);
          window.addEventListener('offline', nativeHandler, false);
        }

        // Remember handlers
        handlers.push(handler);
        nativeHandlers.push(nativeHandler);

        break;
      }
    }
  },

  removeListeners(type, handler): void {
    switch (type) {
      case DEVICE_CONNECTIVITY_EVENT: {
        // Get native handler
        const index = handlers.indexOf(handler);
        const nativeHandler = nativeHandlers[index];

        if (connection) {
          connection.removeEventListener('change', nativeHandler);
        } else {
          window.addEventListener('online', nativeHandler);
          window.addEventListener('offline', nativeHandler);
        }

        // Remove handlers
        handlers.splice(index, 1);
        nativeHandlers.splice(index, 1);

        break;
      }
    }
  },

  async getCurrentState(requestedInterface): Promise<NetInfoNativeModuleState> {
    return getCurrentState(requestedInterface);
  },
};

export default RNCNetInfo;
