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
import {
  AppRegistry,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ConnectionInfoSubscription from './ConnectionInfoSubscription';
import ConnectionInfoCurrent from './ConnectionInfoCurrent';
import IsConnected from './IsConnected';
import IsConnectionExpensive from './IsConnectionExpensive';
import {name as appName} from './app.json';

const EXAMPLES = [
  {
    title: 'NetInfo.isConnected',
    description: 'Asynchronously load and observe connectivity',
    render() {
      return <IsConnected />;
    },
  },
  {
    title: 'NetInfo.update',
    description: 'Asynchronously load and observe connectionInfo',
    render() {
      return <ConnectionInfoCurrent />;
    },
  },
  {
    title: 'NetInfo.updateHistory',
    description: 'Observed updates to connectionInfo',
    render() {
      return <ConnectionInfoSubscription />;
    },
  },
  {
    title: 'NetInfo.isConnectionExpensive (Android)',
    description: 'Asynchronously check isConnectionExpensive',
    render() {
      return <IsConnectionExpensive />;
    },
  },
];

class ExampleApp extends React.Component<{}> {
  render() {
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          {EXAMPLES.map(example => (
            <View key={example.title} style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>{example.title}</Text>
              <Text style={styles.exampleDescription}>
                {example.description}
              </Text>
              <View style={styles.exampleInnerContainer}>
                {example.render()}
              </View>
            </View>
          ))}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  exampleContainer: {
    padding: 16,
    marginVertical: 16,
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  exampleTitle: {
    fontSize: 18,
  },
  exampleDescription: {
    color: '#333333',
    marginBottom: 16,
  },
  exampleInnerContainer: {
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 16,
  },
});

AppRegistry.registerComponent(appName, () => ExampleApp);
