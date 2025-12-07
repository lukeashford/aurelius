import {defineConfig} from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/tailwind.preset.ts',
    'src/tokens/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'tailwindcss'],
  sourcemap: true,
  onSuccess: 'cp -r src/styles dist',
})
