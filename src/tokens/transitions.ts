export const duration = {
  instant: '75ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

export const easing = {
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  snap: 'cubic-bezier(0.5, 0, 0.1, 1)',
} as const

export type DurationToken = keyof typeof duration
export type EasingToken = keyof typeof easing
