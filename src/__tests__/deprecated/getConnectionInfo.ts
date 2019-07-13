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

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('Deprecated', () => {
  describe('getConnectionInfo', () => {
    it('should pass on the responses when the library promise returns', () => {
      const expectedConnectionType = NetInfoStateType.cellular;
      const expectedEffectiveConnectionType = NetInfoCellularGeneration['3g'];

      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: expectedConnectionType,
        isConnected: true,
        isInternetReachable: true,
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
  });
});
