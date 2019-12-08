/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';

import EmitOnListen from './EmitOnListen';
import Fetch from './Fetch';
import HookInitialValue from './HookInitialValue';

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
    id: 'fetch',
    title: 'NetInfo.fetch',
    description: 'Should return when called',
    render() {
      return <Fetch />;
    },
  },
  {
    id: 'hookInitialValue',
    title: 'useNetInfo initial value',
    description: 'Should have an initial value for the hook',
    render() {
      return <HookInitialValue />;
    },
  },
];
