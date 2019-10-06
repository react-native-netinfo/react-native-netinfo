/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import NetInfo from '../src';

interface State {
  connectionInfo: string;
}

export default class ConnectionInfoCurrent extends React.Component<{}, State> {
  state = {
    connectionInfo: 'Tap to get current state',
  };

  componentDidMount() {
    this._fetchState();
  }

  _fetchState = async () => {
    const state = await NetInfo.fetch();
    this.setState({
      connectionInfo: JSON.stringify(state),
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this._fetchState}>
          <Text>{this.state.connectionInfo}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
