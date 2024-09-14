import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist/*'] },
  ...fixupConfigRules(reactRecommended),
  eslintPluginPrettierRecommended,
  jsdoc.configs['flat/recommended'],
  ...ts.config(js.configs.recommended, ...ts.configs.recommended),
  {
    plugins: {
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
    rules: { ...eslintPluginReactHooks.configs.recommended.rules },
  },
  {
    rules: {
      'linebreak-style': ['error', 'unix'],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      'prettier/prettier': 'error',
      'block-scoped-var': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eol-last': 'error',
      'prefer-arrow-callback': 'error',
      'no-trailing-spaces': 'error',
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'describe',
          property: 'only',
        },
        {
          object: 'it',
          property: 'only',
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    settings: { react: { version: 'detect' } },
  },
  {
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-description': 'warn',
      'jsdoc/require-returns': 'off',
      'jsdoc/check-tag-names': 'off',
    },
  },
];
