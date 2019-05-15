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
import {useNetInfo} from '../../src';

interface State {
  triggered: boolean;
}

const HookInitialValue: React.FunctionComponent = () => {
  const netInfo = useNetInfo();
  return (
    <View>
      <View testID="results" style={{flexDirection: 'row'}}>
        <Text testID="result" accessibilityLabel={netInfo ? 'pass' : 'fail'}>
          Has value? {netInfo ? '✅' : '❌'}
        </Text>
      </View>
    </View>
  );
};
export default HookInitialValue;
