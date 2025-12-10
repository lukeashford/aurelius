import type {Config} from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import {colors, duration, easing, radii, shadows, spacing, typography} from './tokens'

const aureliusPlugin = plugin(function ({addBase, addUtilities, theme}) {
  // Base styles
  addBase({
    'html': {
      fontFamily: theme('fontFamily.body'),
      backgroundColor: theme('colors.obsidian'),
      color: theme('colors.white'),
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'body': {
      minHeight: '100vh',
      lineHeight: '1.5',
    },
    'table': {
      borderCollapse: 'collapse',
      width: '100%',
    },
    'table, th, td': {
      border: `1px solid ${theme('colors.gold.muted')}`,
    },
    'th, td': {
      padding: '0.5rem 0.75rem',
    },
    'table:hover': {
      boxShadow: theme('boxShadow.glow'),
    },
    'progress': {
      appearance: 'none',
      '-webkit-appearance': 'none',
      border: `1px solid ${theme('colors.gold.muted')}`,
      borderRadius: '0',
      backgroundColor: theme('colors.charcoal'),
      width: '100%',
      height: '0.5rem',
    },
    'progress::-webkit-progress-bar': {
      backgroundColor: theme('colors.charcoal'),
    },
    'progress::-webkit-progress-value': {
      backgroundColor: theme('colors.gold.DEFAULT'),
    },
    'progress::-moz-progress-bar': {
      backgroundColor: theme('colors.gold.DEFAULT'),
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: theme('fontFamily.heading'),
      fontWeight: '600',
      letterSpacing: '-0.025em',
      color: theme('colors.white'),
    },
    'h1': {fontSize: '2.25rem', lineHeight: '1.25'},
    'h2': {fontSize: '1.875rem', lineHeight: '1.25'},
    'h3': {fontSize: '1.5rem', lineHeight: '1.375'},
    'h4': {fontSize: '1.25rem', lineHeight: '1.375'},
    'h5': {fontSize: '1.125rem', lineHeight: '1.5'},
    'h6': {fontSize: '1rem', lineHeight: '1.5'},
    'code, pre, kbd, samp': {
      fontFamily: theme('fontFamily.mono'),
      fontSize: '0.875em',
    },
    'a': {
      color: theme('colors.gold.DEFAULT'),
      textDecoration: 'none',
      transition: `color ${theme('transitionDuration.fast')} ease-out`,
    },
    'a:hover': {
      color: theme('colors.gold.light'),
    },
    ':focus-visible': {
      outline: `2px solid ${theme('colors.gold.DEFAULT')}`,
      outlineOffset: '2px',
    },
    '::selection': {
      backgroundColor: theme('colors.gold.DEFAULT'),
      color: theme('colors.obsidian'),
    },
    '::-webkit-scrollbar': {width: '8px', height: '8px'},
    '::-webkit-scrollbar-track': {background: theme('colors.charcoal')},
    '::-webkit-scrollbar-thumb': {
      background: theme('colors.ash'),
      borderRadius: theme('borderRadius.full')
    },
    '::-webkit-scrollbar-thumb:hover': {background: theme('colors.silver')},
  })

  // Utility classes
  addUtilities({
    '.text-gradient-gold': {
      background: `linear-gradient(to right, ${theme('colors.gold.DEFAULT')}, ${theme(
          'colors.gold.light')}, ${theme('colors.gold.DEFAULT')})`,
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
      color: 'transparent',
    },
    '.glow': {boxShadow: theme('boxShadow.glow')},
    '.glow-sm': {boxShadow: theme('boxShadow.glow-sm')},
    '.glow-lg': {boxShadow: theme('boxShadow.glow-lg')},
    '.scroll-smooth': {
      scrollBehavior: 'smooth',
      '-webkit-overflow-scrolling': 'touch',
    },
    '.scrollbar-hide': {
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {display: 'none'},
    },
    '.backdrop-glass': {
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(20, 20, 20, 0.8)',
    },
    '.focus-ring': {
      '&:focus-visible': {
        outline: '2px solid #c9a227',
        outlineOffset: '2px',
      },
    },
    '.line-clamp-2': {
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },
    '.line-clamp-3': {
      display: '-webkit-box',
      '-webkit-line-clamp': '3',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },
    '.center-absolute': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  })
})

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Black spectrum
        void: colors.void,
        obsidian: colors.obsidian,
        charcoal: colors.charcoal,
        graphite: colors.graphite,
        slate: colors.slate,
        ash: colors.ash,

        // Gold spectrum
        gold: {
          DEFAULT: colors.gold,
          light: colors.goldLight,
          bright: colors.goldBright,
          muted: colors.goldMuted,
          pale: colors.goldPale,
          glow: colors.goldGlow,
        },

        // Neutrals
        white: colors.white,
        silver: colors.silver,
        zinc: colors.zinc,
        dim: colors.dim,

        // Semantic
        success: {
          DEFAULT: colors.success,
          muted: colors.successMuted,
        },
        error: {
          DEFAULT: colors.error,
          muted: colors.errorMuted,
        },
        warning: {
          DEFAULT: colors.warning,
          muted: colors.warningMuted,
        },
        info: {
          DEFAULT: colors.info,
          muted: colors.infoMuted,
        },
      },

      fontFamily: {
        heading: typography.fontHeading,
        body: typography.fontBody,
        mono: typography.fontMono,
      },

      fontSize: typography.fontSize as any,
      fontWeight: typography.fontWeight as any,
      lineHeight: typography.lineHeight as any,
      letterSpacing: typography.letterSpacing as any,

      spacing: spacing as any,

      borderRadius: radii as any,

      boxShadow: shadows as any,

      transitionDuration: duration as any,

      transitionTimingFunction: easing as any,

      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 150ms ease-in',
        'slide-in-right': `slide-in-right 300ms ${easing.smooth}`,
        'slide-out-right': 'slide-out-right 200ms ease-in',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },

      keyframes: {
        'fade-in': {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
        'fade-out': {
          '0%': {opacity: '1'},
          '100%': {opacity: '0'},
        },
        'slide-in-right': {
          '0%': {transform: 'translateX(100%)', opacity: '0'},
          '100%': {transform: 'translateX(0)', opacity: '1'},
        },
        'slide-out-right': {
          '0%': {transform: 'translateX(0)', opacity: '1'},
          '100%': {transform: 'translateX(100%)', opacity: '0'},
        },
        'pulse-glow': {
          '0%, 100%': {boxShadow: '0 0 20px rgba(201, 162, 39, 0.3)'},
          '50%': {boxShadow: '0 0 30px rgba(201, 162, 39, 0.5)'},
        },
      },
    },
  },
  plugins: [aureliusPlugin]
}

export default preset