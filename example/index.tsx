/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {
  AppRegistry,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ConnectionInfoSubscription from './ConnectionInfoSubscription';
import ConnectionInfoCurrent from './ConnectionInfoCurrent';
import ConnectionInfoFetch from './ConnectionInfoFetch';
import NetInfoHook from './NetInfoHook';
import IsConnected from './IsConnected';

// Examples which show the user how to correctly use the library
interface Example {
  id: string;
  title: string;
  description: string;
  render(): React.ReactNode;
}

const EXAMPLES: Example[] = [
  {
    id: 'isConnected',
    title: 'NetInfo.isConnected',
    description: 'Asynchronously load and observe connectivity',
    render() {
      return <IsConnected />;
    },
  },
  {
    id: 'fetch',
    title: 'NetInfo.fetch',
    description: 'Fetch the state on tap',
    render() {
      return <ConnectionInfoFetch />;
    },
  },
  {
    id: 'currentInfoSingle',
    title: 'Current Info Single',
    description: 'Asynchronously load and observe connectionInfo',
    render() {
      return <ConnectionInfoCurrent />;
    },
  },
  {
    id: 'currentInfoHook',
    title: 'Current Info Hook',
    description:
      'Asynchronously load and observe connectionInfo using a React Hook',
    render() {
      return <NetInfoHook />;
    },
  },
  {
    id: 'currentInfoHistory',
    title: 'Current Info History',
    description: 'Observed updates to connectionInfo',
    render() {
      return <ConnectionInfoSubscription />;
    },
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  sectionTitle: {
    fontSize: 24,
    marginHorizontal: 8,
    marginTop: 24,
  },
  exampleContainer: {
    padding: 16,
    marginVertical: 4,
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

// Test cases for the e2e tests. THESE ARE NOT EXAMPLES OF BEST PRACTICE
import TEST_CASES from './testCases';

interface State {
  activeTestCase: Example | null;
}

class ExampleApp extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      activeTestCase: null,
    };
  }

  componentDidMount() {
    Linking.getInitialURL().then(this._handleOpenURLString);
    if (Platform.OS === 'macos') {
      Linking.addEventListener('url', this._handleOpenURLMacOS);
    } else {
      Linking.addEventListener('url', this._handleOpenURL);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'macos') {
      Linking.removeEventListener('url', this._handleOpenURLMacOS);
    } else {
      Linking.removeEventListener('url', this._handleOpenURL);
    }
  }

  // Receives commands from the test runner when it opens the app with a given URL
  // We use this to decide which test case to show
  _handleOpenURL = ({url}: {url: string}) => {
    this._handleOpenURLString(url);
  };
  _handleOpenURLMacOS = (url: any) => {
    this._handleOpenURLString(url);
  };
  _handleOpenURLString = (url: string | null) => {
    if (!url) {
      return;
    }

    const splitUrl = url.split('://');
    const command = splitUrl.length === 2 ? splitUrl[1].toLowerCase() : null;

    if (command !== 'clear') {
      const foundTestCase = TEST_CASES.find(
        tc => tc.id.toLowerCase() === command,
      );
      if (foundTestCase) {
        this.setState({activeTestCase: foundTestCase});
        return;
      }
    }

    this.setState({activeTestCase: null});
  };

  render() {
    const {activeTestCase} = this.state;
    return (
      <ScrollView testID="scrollView" style={styles.container}>
        <SafeAreaView>
          {activeTestCase ? (
            <>
              <Text testID="testCasesTitle" style={styles.sectionTitle}>
                Test Case
              </Text>
              {this._renderExample(activeTestCase)}
            </>
          ) : (
            <>
              <Text testID="examplesTitle" style={styles.sectionTitle}>
                Examples
              </Text>
              {EXAMPLES.map(this._renderExample)}
            </>
          )}
        </SafeAreaView>
      </ScrollView>
    );
  }

  _renderExample = (example: Example) => {
    return (
      <View
        testID={`example-${example.id}`}
        key={example.title}
        style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>{example.title}</Text>
        <Text style={styles.exampleDescription}>{example.description}</Text>
        <View style={styles.exampleInnerContainer}>{example.render()}</View>
      </View>
    );
  };
}

AppRegistry.registerComponent('NetInfoExample', () => ExampleApp);

// Run application on web
if (typeof document !== 'undefined') {
  AppRegistry.runApplication('NetInfoExample', {
    rootTag: document.getElementById('root'),
  });
}
