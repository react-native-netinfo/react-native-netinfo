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
import {NetInfoStateType} from '../../internal/types';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('Deprecated', () => {
  describe('isConnectionExpensive', () => {
    describe('Android', () => {
      it('should pass the value through when false', () => {
        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: NetInfoStateType.wifi,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: false,
          },
        });
        return expect(NetInfo.isConnectionExpensive()).resolves.toBe(false);
      });

      it('should pass the value through when true', () => {
        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: NetInfoStateType.wifi,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
          },
        });
        return expect(NetInfo.isConnectionExpensive()).resolves.toBe(true);
      });
    });
  });
});
