/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type State = {
  results: boolean[],
};

const TEST_CASE_COUNT = 5;

export default class MultipleIsConnected extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    let results = [];
    for (let i = 0; i < TEST_CASE_COUNT; i++) {
      results.push(false);
    }

    this.state = {results};
  }

  _onPress = () => {
    for (let i = 0; i < TEST_CASE_COUNT; i++) {
      NetInfo.isConnected.fetch().then(isConnected => {
        this.setState(state => {
          const results = state.results.map((result, index) =>
            index === i ? true : result,
          );
          return {results};
        });
      });
    }
  };

  render() {
    return (
      <View>
        <Button
          testID="multipleIsConnectedTestButton"
          onPress={this._onPress}
          title="Reproduce 🕷"
        />
        <View
          testID="multipleIsConnectedResults"
          style={{flexDirection: 'row'}}>
          {this.state.results.map((result, index) => (
            <Text
              key={index}
              testID={`multipleIsConnectedResult${index}`}
              accessibilityLabel={result ? 'pass' : 'fail'}>
              {result ? '✅' : '❌'}
            </Text>
          ))}
        </View>
      </View>
    );
  }
}
