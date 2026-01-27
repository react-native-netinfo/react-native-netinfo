/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeModules} from 'react-native';
import {NetInfoNativeModule} from './privateTypes';

// React Native sets `__turboModuleProxy` on global when TurboModules are enabled.
// Currently, this is the recommended way to detect TurboModules.
// https://reactnative.dev/docs/the-new-architecture/backward-compatibility-turbomodules#unify-the-javascript-specs
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RNCNetInfo: NetInfoNativeModule = isTurboModuleEnabled
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./NativeRNCNetInfo').default
  : NativeModules.RNCNetInfo;

export default RNCNetInfo;
