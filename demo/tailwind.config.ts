import type {Config} from 'tailwindcss'
import aureliusPreset from '@lukeashford/aurelius/tailwind.preset'

export default {
  presets: [aureliusPreset],
  // Only scan demo source files - the preset's safelist ensures all Aurelius classes are generated
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
} satisfies Config
