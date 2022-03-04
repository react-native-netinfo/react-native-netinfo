const project = (() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  try {
    const {
      androidManifestPath,
      iosProjectPath,
      windowsProjectPath,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require('react-native-test-app');
    return {
      android: {
        sourceDir: path.join('example', 'android'),
        manifestPath: androidManifestPath(path.join(__dirname, 'example', 'android')),
      },
      ios: {
        project: iosProjectPath('example/ios'),
      },
      windows: fs.existsSync('example/windows/NetInfoExample.sln') && {
        sourceDir: path.join('example', 'windows'),
        solutionFile: 'NetInfoExample.sln',
        project: windowsProjectPath(path.join(__dirname, 'example', 'windows')),
      },
    };
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Suppress warnings about bob not being a proper native module
    '@react-native-community/bob': {
      platforms: {
        android: null,
        ios: null,
        macos: null,
        windows: null,
      },
    },
    // Help rn-cli find and autolink this library
    '@react-native-community/netinfo': {
      root: __dirname,
    },
  },
  dependency: {
    platforms: {
      windows: {
        sourceDir: 'windows',
        solutionFile: 'RNCNetInfo.sln',
        projects: [
          {
            projectFile: 'RNCNetInfoCPP/RNCNetInfoCPP.vcxproj',
            directDependency: true,
          },
        ],
      },
    },
  },
  ...(project ? { project } : undefined),
};
