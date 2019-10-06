/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useState, useEffect} from 'react';
import State from './internal/state';
import * as Types from './internal/types';

// Call the setup methods of the two state modules right away
const _state = new State();

/**
 * Returns a `Promise` that resolves to a `NetInfoState` object.
 *
 * @returns A Promise which contains the current connection state.
 */
export function fetch(): Promise<Types.NetInfoState> {
  return _state.latest();
}

/**
 * Subscribe to connection information. The callback is called with a parameter of type
 * [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener
 * will be called with the latest information soon after you subscribe and then with any
 * subsequent changes afterwards. You should not assume that the listener is called in the same
 * way across devices or platforms.
 *
 * @param listener The listener which is called when the network state changes.
 *
 * @returns An ofunction which can be called to unsubscribe.
 */
export function addEventListener(
  listener: Types.NetInfoChangeHandler,
): Types.NetInfoSubscription {
  _state.add(listener);
  return (): void => {
    _state.remove(listener);
  };
}

/**
 * A React Hook which updates when the connection state changes.
 *
 * @returns The connection state.
 */
export function useNetInfo(): Types.NetInfoState {
  const [netInfo, setNetInfo] = useState<Types.NetInfoState>({
    type: Types.NetInfoStateType.unknown,
    isConnected: false,
    isInternetReachable: false,
    details: null,
  });

  useEffect((): (() => void) => {
    return addEventListener(setNetInfo);
  }, []);

  return netInfo;
}

export * from './internal/types';

export default {
  fetch,
  addEventListener,
  useNetInfo,
};
