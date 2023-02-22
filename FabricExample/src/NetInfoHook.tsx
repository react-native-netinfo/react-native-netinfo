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
import {useNetInfo} from 'react-native-netinfo';

const Hook: React.FunctionComponent = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text style={{color: 'black'}}>{JSON.stringify(netInfo)}</Text>
    </View>
  );
};

export default Hook;
