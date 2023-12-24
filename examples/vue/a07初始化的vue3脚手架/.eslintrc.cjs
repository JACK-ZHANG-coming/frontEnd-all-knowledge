/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  "rules": {
    "@typescript-eslint/no-this-alias": [
      "error",
      {
        "allowDestructuring": false, // Disallow `const { props, state } = this`; true by default
        "allowedNames": [
          "self"
        ] // Allow `const self = this`; `[]` by default
      }
    ],
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "prefer-const": "off",
    "no-duplicate-imports": "warn",
    "no-multiple-empty-lines": "warn",
    "curly": "off", //大括号
    "no-console": "warn",
    "no-var": "off",
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "no-empty": "off",
    "@typescript-eslint/no-var-requires": 0,
    'vue/multi-word-component-names': 0
  },
}
