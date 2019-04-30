const typescriptEslintRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended.json');
const typescriptEslintPrettier = require('eslint-config-prettier/@typescript-eslint');

module.exports = {
  extends: ["@react-native-community"],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // Apply the recommended Typescript defaults and the prettier overrides to all Typescript files
      rules: Object.assign(typescriptEslintRecommended.rules, typescriptEslintPrettier.rules),
    },
    {
      files: ["**/__tests__/**/*.ts", "**/*.spec.ts"],
      env: {
        jest: true
      },
      rules: {
        // Turn off rules which are useless and annoying for unit test files
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ],
};
