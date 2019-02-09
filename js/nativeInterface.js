/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import {NativeEventEmitter, NativeModules} from 'react-native';

const {RNCNetInfo} = NativeModules;

/**
 * We export the native interface in this way to give easy shared access to it between the
 * JavaScript code and the tests
 */
let nativeEventEmitter = null;
module.exports = {
  RNCNetInfo,
  get NetInfoEventEmitter() {
    if (!nativeEventEmitter) {
      nativeEventEmitter = new NativeEventEmitter(RNCNetInfo);
    }
    return nativeEventEmitter;
  },
};
