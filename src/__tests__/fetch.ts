/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../index';
import NativeInterface from '../internal/nativeInterface';
import {
  NetInfoState,
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../internal/types';

type JestMockNativeInterface = jest.Mocked<typeof NativeInterface>;
/// @ts-ignore
const MockNativeInterface: JestMockNativeInterface = NativeInterface;

describe('@react-native-community/netinfo', () => {
  describe('fetch', () => {
    it('should pass on the responses when the library promise returns', () => {
      const expectedConnectionInfo: NetInfoState = {
        type: NetInfoStateType.cellular,
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      };

      MockNativeInterface.getCurrentState.mockResolvedValue(
        expectedConnectionInfo,
      );

      return expect(NetInfo.fetch()).resolves.toEqual(expectedConnectionInfo);
    });

    it('should pass on errors through the promise chain', () => {
      const expectedError = new Error('A test error');

      MockNativeInterface.getCurrentState.mockRejectedValue(expectedError);

      return expect(NetInfo.fetch()).rejects.toBe(expectedError);
    });
  });
});
