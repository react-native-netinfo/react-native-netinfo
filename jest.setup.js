/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */
/* eslint-env jest */

import {NativeModules} from 'react-native';

// Mock the RNCNetInfo native module to allow us to unit test the JavaScript code
NativeModules.RNCNetInfo = {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

// Reset the mocks before each test
global.beforeEach(() => {
  jest.resetAllMocks();
});
