import {createAureliusESLintConfig} from '../scripts/eslint.mjs';

// Use the main library's base.css for Tailwind class validation
const baseConfig = createAureliusESLintConfig({entryPoint: '../src/styles/base.css'});

// Add ignores for test files (they use custom classes intentionally for testing className passthrough)
export default [
  {
    ignores: ['**/__tests__/**'],
  },
  ...baseConfig,
];
