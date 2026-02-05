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

// React Native sets `__turboModuleProxy` on global when TurboModules are enabled for
// react-native versions < 0.77. After that, they unified access and no longer set
// `__turboModuleProxy` so it fails as a test. However, our native module name
// stays the same, so we can just blindly load using unified loading in RN >= 77
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const legacyTurboModuleAccess = global.__turboModuleProxy != null;

const RNCNetInfo: NetInfoNativeModule = legacyTurboModuleAccess
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./NativeRNCNetInfo').default
  : NativeModules.RNCNetInfo;

export default RNCNetInfo;
