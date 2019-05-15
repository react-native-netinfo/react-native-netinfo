/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Text, View} from 'react-native';
import {useNetInfo} from '../src';

const Hook: React.FunctionComponent = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>{JSON.stringify(netInfo)}</Text>
    </View>
  );
};

export default Hook;
