import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import poupeTailwindcss from '@poupe/eslint-plugin-tailwindcss';
import tsParser from '@typescript-eslint/parser';

export interface AureliusESLintOptions {
  /**
   * Path to your CSS entry file that imports Aurelius
   * @default './src/index.css'
   */
  entryPoint?: string;
}

/**
 * Creates an ESLint configuration that enforces Aurelius design system constraints.
 *
 * This configuration:
 * - Prevents arbitrary Tailwind values (e.g., bg-[#123])
 * - Enforces only Aurelius-approved Tailwind classes
 * - Validates Tailwind v4 CSS usage
 *
 * @param options - Configuration options
 * @returns ESLint configuration array
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
export function createAureliusESLintConfig(options: AureliusESLintOptions = {}): any[] {
  const { entryPoint = './src/index.css' } = options;

  return [
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
          entryPoint,
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
}

// Default export with default entry point for convenience
export default createAureliusESLintConfig();
