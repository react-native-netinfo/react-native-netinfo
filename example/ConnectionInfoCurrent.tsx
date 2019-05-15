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
import NetInfo, {NetInfoState, NetInfoSubscription} from '../src';

interface State {
  connectionInfo: NetInfoState | null;
}

export default class ConnectionInfoCurrent extends React.Component<{}, State> {
  _subscription: NetInfoSubscription | null = null;

  state = {
    connectionInfo: null,
  };

  componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handleConnectionInfoChange,
    );
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
    this.setState({connectionInfo});
  };

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.connectionInfo)}</Text>
      </View>
    );
  }
}
