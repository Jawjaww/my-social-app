const globals = require('globals');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const { fixupPluginRules } = require('@eslint/compat');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    env: {
      node: true, 
      browser: true,
    },
    plugins: {
      'react': eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
      // 'prettier/prettier': 'error'
    },
  },
);