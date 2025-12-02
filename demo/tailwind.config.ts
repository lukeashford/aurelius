import type {Config} from 'tailwindcss'
import aureliusPreset from '@lukeashford/aurelius/tailwind.preset'

export default {
  presets: [aureliusPreset],
  // Limit scanning to demo sources and the built files of the local package to avoid
  // recursively traversing nested node_modules when using "file:.." dependency.
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@lukeashford/aurelius/dist/**/*.{js,mjs,cjs}'
  ],
} satisfies Config
