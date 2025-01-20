const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-plugin-prettier/recommended');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['03-files-in-folder/secret-folder/script.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prettier/prettier': 'error',
    },
  },
  prettier,
];
