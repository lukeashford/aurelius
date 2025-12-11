// eslint.config.mjs
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import poupeTailwindcss from '@poupe/eslint-plugin-tailwindcss';
import tsParser from '@typescript-eslint/parser';

export default [
  // Ignore generated files
  {
    ignores: ['**/generated/**'],
  },

  // JS/TS/React files: enforce allowed Tailwind classes only
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        // Tailwind v4 CSS entry that imports Aurelius + @source
        entryPoint: './src/styles/base.css',
      },
    },
    rules: {
      // Only Tailwind-known classes (no custom classnames)
      'better-tailwindcss/no-unknown-classes': 'error',

      // Block arbitrary value utilities like bg-[...], text-[...], shadow-[...]
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: ['\\[.*\\]'],
        },
      ],
    },
  },

  // CSS files: enforce Tailwind v4 CSS usage and tokens (exclude fonts.css and theme.css)
  {
    files: ['**/*.css'],
    ignores: ['**/fonts.css', '**/theme.css'],
    language: 'tailwindcss/css',
    plugins: {
      tailwindcss: poupeTailwindcss,
    },
    rules: {
      // Start from the plugin's recommended preset
      ...poupeTailwindcss.configs.recommended.rules,

      // Make sure these are at least enabled (or stricter if you want):
      'tailwindcss/no-conflicting-utilities': 'error',
      'tailwindcss/valid-apply-directive': 'error',
      'tailwindcss/valid-modifier-syntax': 'error',
      'tailwindcss/prefer-theme-tokens': 'warn',
      'tailwindcss/no-arbitrary-value-overuse': 'warn',
    },
  },
];
