import {defineConfig} from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/eslint.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'tailwind-resolver'],
  sourcemap: true,
  onSuccess: 'cp -r src/styles dist',
})
