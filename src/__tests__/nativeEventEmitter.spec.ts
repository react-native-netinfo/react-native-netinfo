/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeEventEmitter} from 'react-native';
import RNCNetInfo from '../internal/nativeModule';

jest.mock('../internal/nativeModule');

describe('@react-native-community/netinfo NativeEventEmitter', () => {
  it('accepts the native module as the NativeEventEmitter constructor argument', () => {
    const emitter = new NativeEventEmitter(RNCNetInfo);

    expect(emitter).toBeInstanceOf(NativeEventEmitter);
  });
});
