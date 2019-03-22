/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React from 'react';

import EmitOnListen from './EmitOnListen';
import MultipleIsConnected from './MultipleIsConnected';

export default [
  {
    id: 'emitOnListen',
    title: 'NetInfo.addEventListener Emit on Listen',
    description: 'Should emit when a new listener is added',
    render() {
      return <EmitOnListen />;
    },
  },
  {
    id: 'multipleIsConnected',
    title: 'NetInfo.isConnected.fetch Multiple Calls',
    description: 'Should resolve all promises when calling multiple times',
    render() {
      return <MultipleIsConnected />;
    },
  },
];
