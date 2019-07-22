/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as fetchMock from 'fetch-mock';
import NetInfo from '../index';
import NativeInterface from '../internal/nativeInterface';
import {NetInfoStateType, NetInfoCellularGeneration} from '../internal/types';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

const NEW_URL = 'https://mockedserver.com/generate_200';

describe('@react-native-community/netinfo', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe('setInternetReachabilityTest', () => {
    it('should call the given URL when given a new connected event and the test gives a positive response', async () => {
      fetchMock.mock(NEW_URL, 200);

      NetInfo.setInternetReachabilityTest(
        NEW_URL,
        response => response.status === 200,
      );

      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: NetInfoStateType.cellular,
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      });

      const response = await NetInfo.fetch();
      expect(response.isInternetReachable).toEqual(true);
    });

    it('should call the given URL when given a new connected event and the test gives a negative response', async () => {
      fetchMock.mock(NEW_URL, 404);

      NetInfo.setInternetReachabilityTest(
        NEW_URL,
        response => response.status === 200,
      );

      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: NetInfoStateType.cellular,
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      });

      const response = await NetInfo.fetch();
      expect(response.isInternetReachable).toEqual(true);
    });
  });
});
