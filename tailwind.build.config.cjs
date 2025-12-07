/**
 * Tailwind Build Config for CSS Fallback
 *
 * This config is used to generate precompiled CSS for non-Tailwind consumers.
 * It uses the Aurelius preset and ensures all safelisted utilities are included.
 */

const aureliusPreset = require('./dist/tailwind.preset.js')

module.exports = {
  // Use the Aurelius preset (same as consumers would)
  presets: [aureliusPreset],

  // Scan source CSS and component files to generate only used styles
  content: [
    './src/styles/base.css',
    './src/components/**/*.{ts,tsx}',
  ],

  // Keep preflight for base styles
  corePlugins: {
    preflight: true,
  },
}
