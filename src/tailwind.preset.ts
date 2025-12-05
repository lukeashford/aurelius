import type {Config} from 'tailwindcss'
import {colors, spacing, typography, shadows, duration, easing, radii} from './tokens'
import {aureliusSafelist} from './generated/safelist'

const preset: Partial<Config> = {
  // Safelist all token-derived and structural utilities
  // This ensures Aurelius components work even when consumers only scan their own source files
  safelist: aureliusSafelist,
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
        heading: typography.fontHeading as unknown as string[],
        body: typography.fontBody as unknown as string[],
        mono: typography.fontMono as unknown as string[],
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
}

export default preset
