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
import NetInfo, {NetInfoSubscription} from '../../src';

interface State {
  triggered: boolean;
}

export default class EmitOnListen extends React.Component<{}, State> {
  _subscription: NetInfoSubscription | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      triggered: false,
    };
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  _onPress = () => {
    this._subscription = NetInfo.addEventListener(this._handleConnectionChange);
  };

  _handleConnectionChange = () => {
    this.setState({triggered: true});
  };

  render() {
    const {triggered} = this.state;

    return (
      <View>
        <Button testID="testButton" onPress={this._onPress} title="Trigger" />
        <View testID="results" style={{flexDirection: 'row'}}>
          <Text
            testID="result"
            accessibilityLabel={triggered ? 'pass' : 'fail'}>
            Triggered: {triggered ? '✅' : '❌'}
          </Text>
        </View>
      </View>
    );
  }
}
