/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  resolver: {
    blockList: exclusionList([/node_modules\/react-native-macos\/.*/]),
  },
};
