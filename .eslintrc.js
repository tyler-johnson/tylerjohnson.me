module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    jasmine: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    semi: "warn",
    "no-console": "off",
    "require-atomic-updates": "off",

    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    // TODO no-explicit-any really should be enabled
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, typedefs: false, variables: false },
    ],
    // TODO explicit-function-return-type really should be enabled
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-empty-function": "off",
    // TODO explicit-module-boundary-types should be enabled
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // https://github.com/typescript-eslint/typescript-eslint/issues/60
    "no-redeclare": "off",
    "no-inner-declarations": "off",
    "no-dupe-class-members": "off",
    "@typescript-eslint/no-shadow": "warn",
    "no-shadow": "off",
  },
};
