import {defineConfig} from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'tailwind-resolver'],
  sourcemap: true,
  onSuccess: 'cp -r src/styles dist',
})
