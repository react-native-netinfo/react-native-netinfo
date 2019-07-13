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
import {NetInfoStateType, NetInfoCellularGeneration} from '../internal/types';
import {NetInfoNativeModuleState} from '../internal/privateTypes';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('@react-native-community/netinfo', () => {
  describe('fetch', () => {
    it('should pass on the responses when the library promise returns', () => {
      const expectedConnectionInfo: NetInfoNativeModuleState = {
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      };

      NativeInterface.eventEmitter.emit(
        DEVICE_CONNECTIVITY_EVENT,
        expectedConnectionInfo,
      );

      return expect(NetInfo.fetch()).resolves.toEqual(expectedConnectionInfo);
    });
  });
});
