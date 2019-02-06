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
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class IsConnectionExpensive extends React.Component {
  state = {
    isConnectionExpensive: null,
  };

  _checkIfExpensive = () => {
    NetInfo.isConnectionExpensive().then(isConnectionExpensive => {
      this.setState({isConnectionExpensive});
    });
  };

  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this._checkIfExpensive}>
          <View>
            <Text>
              Click to see if connection is expensive:
              {this.state.isConnectionExpensive === true
                ? 'Expensive'
                : this.state.isConnectionExpensive === false
                  ? 'Not expensive'
                  : 'Unknown'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
