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
import {Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class ConnectionInfoSubscription extends React.Component<
  {},
  $FlowFixMe,
> {
  state = {
    connectionInfoHistory: [],
  };

  componentDidMount() {
    NetInfo.addEventListener(
      'connectionChange',
      this._handleConnectionInfoChange,
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this._handleConnectionInfoChange,
    );
  }

  _handleConnectionInfoChange = connectionInfo => {
    const connectionInfoHistory = this.state.connectionInfoHistory.slice();
    connectionInfoHistory.push(connectionInfo);
    this.setState({
      connectionInfoHistory,
    });
  };

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.connectionInfoHistory)}</Text>
      </View>
    );
  }
}
