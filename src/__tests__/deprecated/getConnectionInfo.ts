/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../../index';
import NativeInterface from '../../internal/nativeInterface';
import {
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../../internal/types';

type JestMockNativeInterface = jest.Mocked<typeof NativeInterface>;
/// @ts-ignore
const MockNativeInterface: JestMockNativeInterface = NativeInterface;

describe('Deprecated', () => {
  describe('getConnectionInfo', () => {
    it('should pass on the responses when the library promise returns', () => {
      const expectedConnectionType = NetInfoStateType.cellular;
      const expectedEffectiveConnectionType = NetInfoCellularGeneration['3g'];

      MockNativeInterface.getCurrentState.mockResolvedValue({
        type: expectedConnectionType,
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: expectedEffectiveConnectionType,
        },
      });

      return expect(NetInfo.getConnectionInfo()).resolves.toEqual({
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      });
    });

    it('should pass on errors through the promise chain', () => {
      const expectedError = new Error('A test error');

      MockNativeInterface.getCurrentState.mockRejectedValue(expectedError);

      return expect(NetInfo.getConnectionInfo()).rejects.toBe(expectedError);
    });
  });
});
