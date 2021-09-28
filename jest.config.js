/**
 * @format
 */

module.exports = {
  preset: 'react-native',
  displayName: {name: 'Native', color: 'cyan'},
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
