/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {EventSubscriptionVendor} from 'react-native';
import {NetInfoState} from './types';

export interface NetInfoNativeModule extends EventSubscriptionVendor {
  getCurrentState: () => Promise<NetInfoState>;
}
