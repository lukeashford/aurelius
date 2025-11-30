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
