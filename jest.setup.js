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

// Mock the RNCNetInfo native module to allow us to unit test the JavaScript code
NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
  type: NetInfoStateType.cellular,
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: true,
    cellularGeneration: NetInfoCellularGeneration['3g'],
  },
});

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

  require('./src/internal/deprecatedState').setup();
  require('./src/internal/state').setup();
});

global.afterEach(() => {
  require('./src/internal/deprecatedState').tearDown();
  require('./src/internal/state').tearDown();
});
