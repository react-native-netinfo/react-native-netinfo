/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeEventEmitter} from 'react-native';
import RNCNetInfo from './nativeModule';
import {DEVICE_CONNECTIVITY_EVENT} from './privateTypes';

const nativeEventEmitter = new NativeEventEmitter();

// Listen to connectivity events
RNCNetInfo.addListener(
  DEVICE_CONNECTIVITY_EVENT,
  (event): void => {
    nativeEventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, event);
  },
);

export default {
  ...RNCNetInfo,
  eventEmitter: nativeEventEmitter,
};
