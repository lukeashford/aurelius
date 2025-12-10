import type {Config} from 'tailwindcss'
import aureliusPreset from '@lukeashford/aurelius/tailwind.preset'

export default {
  presets: [aureliusPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@lukeashford/aurelius/dist/**/*.{js,mjs}',
  ],
} satisfies Config
