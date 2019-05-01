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
import NetInfo, {NetInfoData} from '../js';

interface State {
  connectionInfoHistory: NetInfoData[];
}

export default class ConnectionInfoSubscription extends React.Component<
  {},
  State
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

  _handleConnectionInfoChange = (connectionInfo: NetInfoData) => {
    this.setState(({connectionInfoHistory}) => ({
      connectionInfoHistory: [...connectionInfoHistory, connectionInfo],
    }));
  };

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.connectionInfoHistory)}</Text>
      </View>
    );
  }
}
