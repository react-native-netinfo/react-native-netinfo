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

const RNCNetInfo: NetInfoNativeModule = NativeModules.RNCNetInfo;

export default RNCNetInfo;
