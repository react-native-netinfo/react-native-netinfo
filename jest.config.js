/**
 * @format
 */
const defaultConfiguration = {
  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native)'],
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
};

module.exports = {
  projects: [
    {
      preset: 'jest-expo/ios',
      ...defaultConfiguration,
    },
    {
      preset: 'jest-expo/android',
      ...defaultConfiguration,
    },
    {
      preset: 'jest-expo/web',
      ...defaultConfiguration,
    },
  ],
};
