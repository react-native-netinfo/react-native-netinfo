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

import MultipleIsConnected from './MultipleIsConnected';

export default [
  {
    id: 'multipleIsConnected',
    title: 'NetInfo.isConnected.fetch Multiple Calls',
    description: 'Should resolve all promises when calling multiple times',
    render() {
      return <MultipleIsConnected />;
    },
  },
];
