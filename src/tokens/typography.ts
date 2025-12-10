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
