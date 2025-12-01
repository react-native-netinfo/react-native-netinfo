/**
 * This cli config is needed for development purposes, e.g. for running
 * integration tests during local development or on CI services.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exclusionList = require('metro-config/src/defaults/exclusionList');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * This config is a bit exotic because our example app is not its own package
 * (that would require setting this repo up as a monorepo). We need to tell
 * Metro that the root of the project is our `example` folder (`projectRoot`),
 * and that it should look for modules in repo root (`watchFolders`) as this is
 * where the `node_modules` folder lives. Metro will otherwise fail to resolve
 * anything.
 */
module.exports = {
  projectRoot: path.join(__dirname, 'example'),
  watchFolders: [__dirname],
  resolver: {
    blockList: exclusionList([
      /node_modules\/.*\/node_modules\/react-native\/.*/,

      // Workaround for `EPERM: operation not permitted, lstat '~\midl-MIDLRT-cl.read.1.tlog'`
      /.*\.tlog/,

      // This stops "react-native run-windows" from causing the metro server to
      // crash if its already running
      new RegExp(`${path.join(__dirname, 'windows').replace(/[/\\]+/g, '/')}.*`),

      // Workaround for `EBUSY: resource busy or locked, open '~\msbuild.ProjectImports.zip'`
      /.*\.ProjectImports\.zip/,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
