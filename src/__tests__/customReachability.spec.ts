/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fetchMock from 'jest-fetch-mock';
import NetInfo from '../index';
import NativeInterface from '../internal/nativeInterface';
import {DEVICE_CONNECTIVITY_EVENT} from '../internal/privateTypes';
import {NetInfoStateType} from '../internal/types';

fetchMock.enableMocks();
jest.mock('../internal/nativeModule');
const mockNativeModule = jest.requireMock('../internal/nativeModule').default;

describe('custom internet reachability', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.resetMocks();
    mockNativeModule.getCurrentState.mockReset();
  });

  afterEach(() => {
    // Stop the custom probe and its retry timer before returning to real timers.
    NetInfo.configure({useNativeReachability: true});
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each([true, false])(
    'ignores native reachability = %s when useNativeReachability is false',
    async (nativeReachability) => {
      const nativeState = {
        type: NetInfoStateType.wifi,
        isConnected: true,
        isInternetReachable: nativeReachability,
        details: {isConnectionExpensive: false},
      };
      mockNativeModule.getCurrentState.mockResolvedValue(nativeState);
      // Make the server result disagree with the native result.
      fetchMock.mockResponse('', {status: nativeReachability ? 500 : 200});
      NetInfo.configure({
        useNativeReachability: false,
        reachabilityTest: async (response) => response.status === 200,
      });
      await NetInfo.fetch();
      await jest.advanceTimersByTimeAsync(0);
      expect((await NetInfo.fetch()).isInternetReachable).toBe(
        !nativeReachability,
      );

      const listener = jest.fn();
      const unsubscribe = NetInfo.addEventListener(listener);
      listener.mockClear();
      const refreshed = await NetInfo.refresh();
      expect(refreshed.isInternetReachable).not.toBe(nativeReachability);
      expect(listener).not.toHaveBeenCalledWith(
        expect.objectContaining({isInternetReachable: nativeReachability}),
      );

      await jest.advanceTimersByTimeAsync(0);
      listener.mockClear();
      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, nativeState);
      expect(listener).not.toHaveBeenCalledWith(
        expect.objectContaining({isInternetReachable: nativeReachability}),
      );
      await jest.advanceTimersByTimeAsync(0);
      expect((await NetInfo.fetch()).isInternetReachable).toBe(
        !nativeReachability,
      );
      unsubscribe();
    },
  );

  it.each([true, false])(
    'preserves native reachability = %s when enabled',
    async (nativeReachability) => {
      mockNativeModule.getCurrentState.mockResolvedValue({
        type: NetInfoStateType.wifi,
        isConnected: true,
        isInternetReachable: nativeReachability,
        details: {isConnectionExpensive: false},
      });
      NetInfo.configure({useNativeReachability: true});
      expect((await NetInfo.refresh()).isInternetReachable).toBe(
        nativeReachability,
      );
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
