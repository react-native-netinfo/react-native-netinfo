/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rnmPath = path.resolve(__dirname, 'node_modules/react-native-macos');

module.exports = {
  resolver: {
    extraNodeModules: {
      'react-native': rnmPath,
    },
    platforms: ['macos', 'ios'],
    blockList: exclusionList([/node_modules\/react-native\/.*/]),
  },
};
