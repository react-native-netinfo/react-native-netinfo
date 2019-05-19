/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

jest.mock('Platform', () => {
  const Platform = jest.requireActual('Platform');
  Platform.OS = 'ios';
  return Platform;
});

import NetInfo from '../../index';
import NativeInterface from '../../internal/nativeInterface';
import {NetInfoStateType} from '../../internal/types';

type JestMockNativeInterface = jest.Mocked<typeof NativeInterface>;
/// @ts-ignore
const MockNativeInterface: JestMockNativeInterface = NativeInterface;

describe('Deprecated', () => {
  describe('isConnectionExpensive', () => {
    describe('iOS', () => {
      it('should reject with an error when called', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.wifi,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: false,
          },
        });
        return expect(NetInfo.isConnectionExpensive()).rejects.toThrowError();
      });
    });
  });
});
