/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useState, useEffect, useCallback} from 'react';
import {Platform} from 'react-native';
import DEFAULT_CONFIGURATION from './internal/defaultConfiguration';
import NativeInterface from './internal/nativeInterface';
import State from './internal/state';
import * as Types from './internal/types';

// Stores the currently used configuration
let _configuration = DEFAULT_CONFIGURATION;

// Stores the singleton reference to the state manager
let _state: State | null = null;
const createState = (): State => {
  return new State(_configuration);
};

/**
 * Configures the library with the given configuration. Note that calling this will stop all
 * previously added listeners from being called again. It is best to call this right when your
 * application is started to avoid issues. The configuration sets up a global singleton instance.
 *
 * @param configuration The new configuration to set.
 */
export function configure(
  configuration: Partial<Types.NetInfoConfiguration>,
): void {
  _configuration = {
    ...DEFAULT_CONFIGURATION,
    ...configuration,
  };

  if (_state) {
    _state.tearDown();
    _state = createState();
  }

  if (Platform.OS === 'ios') {
    NativeInterface.configure(configuration);
  }
}

/**
 * Returns a `Promise` that resolves to a `NetInfoState` object.
 * This function operates on the global singleton instance configured using `configure()`
 *
 * @param [requestedInterface] interface from which to obtain the information
 *
 * @returns A Promise which contains the current connection state.
 */
export function fetch(
  requestedInterface?: string,
): Promise<Types.NetInfoState> {
  if (!_state) {
    _state = createState();
  }
  return _state.latest(requestedInterface);
}

/**
 * Force-refreshes the internal state of the global singleton managed by this library.
 *
 * @returns A Promise which contains the updated connection state.
 */
export function refresh(): Promise<Types.NetInfoState> {
  if (!_state) {
    _state = createState();
  }
  return _state._fetchCurrentState();
}

/**
 * Subscribe to the global singleton's connection information. The callback is called with a parameter of type
 * [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener
 * will be called with the latest information soon after you subscribe and then with any
 * subsequent changes afterwards. You should not assume that the listener is called in the same
 * way across devices or platforms.
 *
 * @param listener The listener which is called when the network state changes.
 *
 * @returns A function which can be called to unsubscribe.
 */
export function addEventListener(
  listener: Types.NetInfoChangeHandler,
): Types.NetInfoSubscription {
  if (!_state) {
    _state = createState();
  }

  _state.add(listener);
  return (): void => {
    _state && _state.remove(listener);
  };
}

/**
 * A React Hook into this library's singleton which updates when the connection state changes.
 *
 * @param {Partial<Types.NetInfoConfiguration>} configuration - Configure the isolated network checker managed by this hook
 *
 * @returns The connection state.
 */
export function useNetInfo(
  configuration?: Partial<Types.NetInfoConfiguration>,
): Types.NetInfoState {
  if (configuration) {
    configure(configuration);
  }

  const [netInfo, setNetInfo] = useState<Types.NetInfoState>({
    type: Types.NetInfoStateType.unknown,
    isConnected: null,
    isInternetReachable: null,
    details: null,
  });

  useEffect((): (() => void) => {
    return addEventListener(setNetInfo);
  }, []);

  return netInfo;
}

/**
 * A React Hook which manages an isolated instance of the network info manager.
 * This is not a hook into a singleton shared state. NetInfo.configure, NetInfo.addEventListener,
 * NetInfo.fetch, NetInfo.refresh are performed on a global singleton and have no affect on this hook.
 * @param {boolean} isPaused - Pause the internal network checks.
 * @param {Partial<Types.NetInfoConfiguration>} configuration - Configure the isolated network checker managed by this hook
 *
 * @returns the netInfo state and a refresh function
 */
export function useNetInfoInstance(
  isPaused = false,
  configuration?: Partial<Types.NetInfoConfiguration>,
) {
  const [networkInfoManager, setNetworkInfoManager] = useState<State>();
  const [netInfo, setNetInfo] = useState<Types.NetInfoState>({
    type: Types.NetInfoStateType.unknown,
    isConnected: null,
    isInternetReachable: null,
    details: null,
  });

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const config = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
    };
    const state = new State(config);
    setNetworkInfoManager(state);
    state.add(setNetInfo);
    return state.tearDown;
  }, [isPaused, configuration]);

  const refresh = useCallback(() => {
    networkInfoManager && networkInfoManager._fetchCurrentState();
  }, [networkInfoManager]);

  return {
    netInfo,
    refresh,
  };
}

export * from './internal/types';

export default {
  configure,
  fetch,
  refresh,
  addEventListener,
  useNetInfo,
  useNetInfoInstance,
};
