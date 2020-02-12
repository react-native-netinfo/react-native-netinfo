// jest.config.js
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  'projects': [
    { 'preset': 'jest-expo/ios' },
    { 'preset': 'jest-expo/android' },
    { 'preset': 'jest-expo/web' },
  ],
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/node_modules/', '<rootDir>/example/'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
