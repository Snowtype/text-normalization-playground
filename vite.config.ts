import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Relative base ("./") keeps the built asset URLs portable: the same `dist/`
// works when served from a domain root (Vercel) or from a GitHub Pages
// project subpath (https://user.github.io/text-normalization-playground/).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/tn/**/*.ts'],
      exclude: ['src/tn/**/*.test.ts', 'src/tn/testCases.ts'],
      reporter: ['text', 'html'],
    },
  },
});
