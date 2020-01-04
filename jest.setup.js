/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* eslint-env jest */

import {NativeModules} from 'react-native';
import {
  NetInfoStateType,
  NetInfoCellularGeneration,
} from './src/internal/types';
import RNCNetInfoMock from './jest/netinfo-mock.js';

// Mock the RNCNetInfo native module to allow us to unit test the JavaScript code
NativeModules.RNCNetInfo = RNCNetInfoMock;

// Reset the mocks before each test
global.beforeEach(() => {
  jest.resetAllMocks();

  NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
    type: NetInfoStateType.cellular,
    isConnected: true,
    isInternetReachable: true,
    details: {
      isConnectionExpensive: true,
      cellularGeneration: NetInfoCellularGeneration['3g'],
    },
  });
});
