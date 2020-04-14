/**
 * @format
 */

const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
  projects: [
    {
      ...tsjPreset,
      displayName: {name: 'Native', color: 'cyan'},
      preset: 'react-native',
      transform: {
        ...tsjPreset.transform,
        '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
      },
      testPathIgnorePatterns: [
        '<rootDir>/lib/',
        '<rootDir>/node_modules/',
        '<rootDir>/example/',
      ],
      globals: {
        'ts-jest': {
          babelConfig: true,
        },
      },
    },
    {preset: 'jest-expo/web'},
  ],
};
