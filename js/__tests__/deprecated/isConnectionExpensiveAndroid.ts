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
  Platform.OS = 'android';
  return Platform;
});

import NetInfo from '../../index';
import NativeInterface from '../../internal/nativeInterface';

const MockNativeInterface: jest.Mocked<typeof NativeInterface> = NativeInterface as any;

describe('Deprecated', () => {
  describe('isConnectionExpensive', () => {
    describe('Android', () => {
      it('should pass the value through when false', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: "wifi",
          isConnected: true,
          details: {
            isConnectionExpensive: false
          },
        });
        return expect(NetInfo.isConnectionExpensive()).resolves.toBe(
          false
        );
      });

      it('should pass the value through when true', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: "wifi",
          isConnected: true,
          details: {
            isConnectionExpensive: true
          },
        });
        return expect(NetInfo.isConnectionExpensive()).resolves.toBe(
          true
        );
      });
    });
  });
});
