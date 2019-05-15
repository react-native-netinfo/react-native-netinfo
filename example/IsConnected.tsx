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
import NetInfo, {NetInfoSubscription, NetInfoState} from '../src';

interface State {
  isConnected: boolean | null;
}

export default class IsConnected extends React.Component<{}, State> {
  _subscription: NetInfoSubscription | null = null;

  state = {
    isConnected: null,
  };

  componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handleConnectivityChange,
    );
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  _handleConnectivityChange = (state: NetInfoState) => {
    this.setState({
      isConnected: state.isConnected,
    });
  };

  render() {
    return (
      <View>
        <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
      </View>
    );
  }
}
