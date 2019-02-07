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
import { Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class ConnectionInfoCurrent extends React.Component<{}, $FlowFixMe> {
  state = {
    connectionInfo: null,
  };

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this._handleConnectionInfoChange);
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({connectionInfo});
    });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this._handleConnectionInfoChange);
  }

  _handleConnectionInfoChange = connectionInfo => {
    this.setState({
      connectionInfo,
    });
  };

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.connectionInfo)}</Text>
      </View>
    );
  }
}
