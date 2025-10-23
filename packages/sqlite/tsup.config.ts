import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: 'es2022',
  outDir: 'dist',
  bundle: true,
  platform: 'node',
  external: ['better-sqlite3', '@rinari/types'],
});
