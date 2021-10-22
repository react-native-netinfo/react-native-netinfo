/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // Apply the recommended Typescript defaults and the prettier overrides to all Typescript files
      rules: {
        '@typescript-eslint/explicit-member-accessibility': 'off',
      },
    },
    {
      files: ['example/**/*.ts', 'example/**/*.tsx'],
      rules: {
        // Turn off rules which are useless and annoying for the example files files
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.ts', '**/*.spec.ts'],
      env: {
        jest: true,
      },
      rules: {
        // Turn off rules which are useless and annoying for unit test files
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
