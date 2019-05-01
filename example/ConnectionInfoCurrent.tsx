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
  connectionInfo: NetInfoData | null;
}

export default class ConnectionInfoCurrent extends React.Component<{}, State> {
  state = {
    connectionInfo: null,
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
