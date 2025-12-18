// scripts/eslint.mjs
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import poupeTailwindcss from '@poupe/eslint-plugin-tailwindcss';
import css from '@eslint/css';
import {tailwind4} from 'tailwind-csstree';
import tsParser from '@typescript-eslint/parser';

/**
 * @typedef {Object} AureliusESLintOptions
 * @property {string} [entryPoint] - Path to your CSS entry file that imports Aurelius. Defaults to
 *     './src/index.css'
 */

/**
 * Creates an ESLint configuration that enforces Aurelius design system constraints.
 *
 * This configuration:
 * - Prevents arbitrary Tailwind values (e.g., bg-[#123])
 * - Enforces only Aurelius-approved Tailwind classes
 * - Validates Tailwind v4 CSS usage
 *
 * @param {AureliusESLintOptions} [options={}] - Configuration options
 * @returns {any[]} ESLint configuration array
 *
 * @example
 * // With default entry point (./src/index.css)
 * import { createAureliusESLintConfig } from '@lukeashford/aurelius/eslint';
 * export default createAureliusESLintConfig();
 *
 * @example
 * // With custom entry point
 * import { createAureliusESLintConfig } from '@lukeashford/aurelius/eslint';
 * export default createAureliusESLintConfig({ entryPoint: './app/styles.css' });
 */
export function createAureliusESLintConfig(options = {}) {
  const {entryPoint = './src/index.css'} = options;

  return [
    // Ignore generated files
    {
      ignores: ['**/generated/**', '**/dist/**'],
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
          entryPoint,
        },
      },
      rules: {
        // Only Tailwind-known classes (no custom classnames)
        'better-tailwindcss/no-unknown-classes': [
          'error',
          {
            // Allow custom classes when they are defined using Aurelius/Tailwind utilities
            // (e.g., `@utility x { @apply bg-obsidian text-white; }`).
            // This still blocks any class that isn't generated from the Aurelius-based
            // Tailwind pipeline, so "a&b"-style composites are fine but "c" isn't if
            // it doesn't come from Aurelius tokens.
            detectComponentClasses: true,
            // Also check variables that store class mappings (e.g., variantClasses objects)
            variables: [
              ['^.*[Cc]lass(?:es|Name)?$', [{match: 'strings'}]],
              ['^.*[Cc]lass(?:es|Name)?$', [{match: 'objectValues'}]],
            ],
          },
        ],

        // Block arbitrary value utilities like bg-[...], text-[...], shadow-[...]
        'better-tailwindcss/no-restricted-classes': [
          'error',
          {
            restrict: ['\\[.*\\]'],
            // Also check variables that store class mappings (e.g., variantClasses objects)
            variables: [
              ['^.*[Cc]lass(?:es|Name)?$', [{match: 'strings'}]],
              ['^.*[Cc]lass(?:es|Name)?$', [{match: 'objectValues'}]],
            ],
          },
        ],
      },
    },

    // CSS files: enforce Tailwind v4 CSS usage and tokens (exclude fonts.css and theme.css)
    {
      files: ['**/*.css'],
      ignores: ['**/fonts.css', '**/theme.css'],
      language: 'css/css',
      languageOptions: {
        customSyntax: tailwind4,
      },
      plugins: {
        css,
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
        'tailwindcss/no-arbitrary-value-overuse': 'error',
      },
    },
  ];
}

// Default export with default entry point for convenience
export default createAureliusESLintConfig();
