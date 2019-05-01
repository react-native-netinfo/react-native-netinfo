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
import NetInfo from '../../js';

interface State {
  triggered: boolean;
}

export default class MultipleIsConnected extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      triggered: false,
    };
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this._handleConnectionChange,
    );
  }

  _onPress = () => {
    NetInfo.addEventListener('connectionChange', this._handleConnectionChange);
  };

  _handleConnectionChange = () => {
    this.setState({triggered: true});
  };

  render() {
    const {triggered} = this.state;

    return (
      <View>
        <Button
          testID="emitOnListenTestButton"
          onPress={this._onPress}
          title="Reproduce 🕷"
        />
        <View testID="emitOnListenResults" style={{flexDirection: 'row'}}>
          <Text
            testID="emitOnListenResult"
            accessibilityLabel={triggered ? 'pass' : 'fail'}>
            Triggered: {triggered ? '✅' : '❌'}
          </Text>
        </View>
      </View>
    );
  }
}
