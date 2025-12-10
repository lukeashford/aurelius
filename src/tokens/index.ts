// Re-export generated tokens from tailwind-resolver
export * from './generated'
export { defaultTheme, variants, selectors, tailwind } from './generated'

/**
 * Backward-compatible token exports
 *
 * ⚠️ IMPORTANT: These values MUST match src/styles/theme.css
 * If you update theme.css, update these values to match!
 *
 * The tailwind-resolver generates tokens in ./generated/, but those have
 * a different structure. These flat exports maintain backward compatibility.
 */

/** Color tokens - flat object of all design system colors */
export const colors = {
  // Black spectrum
  void: '#000000',
  obsidian: '#0a0a0a',
  charcoal: '#141414',
  graphite: '#1f1f1f',
  slate: '#2a2a2a',
  ash: '#3d3d3d',

  // Gold spectrum
  gold: '#c9a227',
  goldLight: '#d4b84a',
  goldBright: '#e5c84d',
  goldMuted: '#8b7355',
  goldPale: '#d4c4a8',
  goldGlow: 'rgba(201, 162, 39, 0.15)',

  // Neutrals
  white: '#ffffff',
  silver: '#a3a3a3',
  zinc: '#71717a',
  dim: '#52525b',

  // Semantic
  success: '#22c55e',
  successMuted: '#166534',
  error: '#dc2626',
  errorMuted: '#991b1b',
  warning: '#d97706',
  warningMuted: '#92400e',
  info: '#0ea5e9',
  infoMuted: '#0369a1',
} as const

export type ColorToken = keyof typeof colors

/** Typography tokens */
export const typography = {
  // Headings use Marcellus, a classic serif
  fontHeading: '"Marcellus", serif',
  // Body and UI use Raleway
  fontBody: '"Raleway", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',

  fontSize: {
    xs: ['0.75rem', {lineHeight: '1rem'}],
    sm: ['0.875rem', {lineHeight: '1.25rem'}],
    base: ['1rem', {lineHeight: '1.5rem'}],
    lg: ['1.125rem', {lineHeight: '1.75rem'}],
    xl: ['1.25rem', {lineHeight: '1.75rem'}],
    '2xl': ['1.5rem', {lineHeight: '2rem'}],
    '3xl': ['1.875rem', {lineHeight: '2.25rem'}],
    '4xl': ['2.25rem', {lineHeight: '2.5rem'}],
    '5xl': ['3rem', {lineHeight: '1'}],
    '6xl': ['3.75rem', {lineHeight: '1'}],
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

export type TypographyToken = keyof typeof typography

/** Spacing tokens */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
} as const

export type SpacingToken = keyof typeof spacing

/** Border radius tokens */
export const radii = {
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.375rem',
  xl: '0.5rem',
  '2xl': '0.75rem',
  '3xl': '1rem',
  full: '9999px',
} as const

export type RadiusToken = keyof typeof radii

/** Shadow tokens */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  glow: '0 0 20px rgba(201, 162, 39, 0.3)',
  'glow-sm': '0 0 10px rgba(201, 162, 39, 0.2)',
  'glow-lg': '0 0 40px rgba(201, 162, 39, 0.4)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
} as const

export type ShadowToken = keyof typeof shadows

/** Transition duration tokens */
export const duration = {
  instant: '75ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

export type DurationToken = keyof typeof duration

/** Easing tokens */
export const easing = {
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  snap: 'cubic-bezier(0.5, 0, 0.1, 1)',
} as const

export type EasingToken = keyof typeof easing
