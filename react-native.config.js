/**
 * This cli config is needed for the coexistance of react-native and other
 * out-of-tree implementations such react-native-macos.
 * The following issue is tracked by
 * https://github.com/react-native-community/discussions-and-proposals/issues/182
 *
 * The work-around involves having a metro.config.js for each out-of-tree
 * platform, i.e. metro.config.js for react-native and
 * metro.config.macos.js for react-native-macos.
 * This react-native.config.js looks for a --use-react-native-macos
 * switch and when present pushes --config=metro.config.macos.js
 * and specifies reactNativePath: 'node_modules/react-native-macos'.
 * The metro.config.js has to blacklist 'node_modules/react-native-macos',
 * and conversely metro.config.macos.js has to blacklist 'node_modules/react-native'.
 */
'use strict';

const macSwitch = '--use-react-native-macos';
const windowsSwitch = '--use-react-native-windows';
let config = {
  project: {
    ios: {
      // this works but only in combination with `yarn react-native run-ios --project-path `pwd`/ios` - at least it works...
      project: './example/ios/NetInfoExample.xcodeproj',
    },
    android:{
      sourceDir: 'example/android',
    }
  },
}
if (process.argv.includes(macSwitch)) {
  process.argv = process.argv.filter(arg => arg !== macSwitch);
  process.argv.push('--config=metro.config.macos.js');
  config = {
    ...config,
    reactNativePath: 'node_modules/react-native-macos',
  };
} else if (process.argv.includes(windowsSwitch)) {
  process.argv = process.argv.filter(arg => arg !== windowsSwitch);
  process.argv.push('--config=metro.config.windows.js');
  config = {
    ...config,
    reactNativePath: 'node_modules/react-native-windows',
  };
}
module.exports = config
