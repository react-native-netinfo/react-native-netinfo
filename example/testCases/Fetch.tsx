/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Button, Text, View} from 'react-native';
import NetInfo, {NetInfoState} from '../../src';

interface State {
  netInfoState: NetInfoState | null;
}

export default class Fetch extends React.Component<
  Record<string, unknown>,
  State
> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      netInfoState: null,
    };
  }

  _onPress = async (): Promise<void> => {
    const netInfoState = await NetInfo.fetch();
    this.setState({netInfoState});
  };

  render(): JSX.Element {
    const {netInfoState} = this.state;

    return (
      <View>
        <Button testID="testButton" onPress={this._onPress} title="Trigger" />
        <View testID="results" style={{flexDirection: 'row'}}>
          <Text
            testID="result"
            accessibilityLabel={netInfoState ? 'pass' : 'fail'}>
            Triggered: {netInfoState ? '✅' : '❌'}
          </Text>
        </View>
      </View>
    );
  }
}
