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
 
 // @ts-ignore
 const isTurboModuleEnabled = global.__turboModuleProxy != null;
 
 const RNCNetInfo: NetInfoNativeModule = isTurboModuleEnabled ?
     require('./NativeRNCNetInfo').default :
     NativeModules.RNCNetInfo;
 
 export default RNCNetInfo;
 