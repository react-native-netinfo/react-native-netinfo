module.exports = {
  extends: ["@react-native-community"],
  overrides: [
    {
      files: ["**/__tests__/**/*.ts", "**/*.spec.ts"],
      env: {
        jest: true
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ],
};
