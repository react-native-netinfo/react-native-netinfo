/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';

import DeprecatedEmitOnListen from './DeprecatedEmitOnListen';
import DeprecatedMultipleGetConnectionInfo from './DeprecatedMultipleGetConnectionInfo';
import DeprecatedMultipleIsConnectedFetch from './DeprecatedMultipleIsConnectedFetch';
import EmitOnListen from './EmitOnListen';
import Fetch from './Fetch';

export default [
  {
    id: 'deprecatedEmitOnListen',
    title: 'Deprecated NetInfo.addEventListener Emit on Listen',
    description: 'Should emit when a new listener is added',
    render() {
      return <DeprecatedEmitOnListen />;
    },
  },
  {
    id: 'deprecatedMultipleGetConnectionInfo',
    title: 'Deprecated NetInfo.getConnectionInfo Multiple Calls',
    description: 'Should resolve all promises when calling multiple times',
    render() {
      return <DeprecatedMultipleGetConnectionInfo />;
    },
  },
  {
    id: 'deprecatedMultipleIsConnectedFetch',
    title: 'Deprecated NetInfo.isConnected.fetch Multiple Calls',
    description: 'Should resolve all promises when calling multiple times',
    render() {
      return <DeprecatedMultipleIsConnectedFetch />;
    },
  },
  {
    id: 'emitOnListen',
    title: 'NetInfo.addEventListener Emit on Listen',
    description: 'Should emit when a new listener is added',
    render() {
      return <EmitOnListen />;
    },
  },
  {
    id: 'Fetch',
    title: 'NetInfo.fetch',
    description: 'Should return when called',
    render() {
      return <Fetch />;
    },
  },
];
