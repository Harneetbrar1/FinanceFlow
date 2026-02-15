import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration for FinanceFlow Frontend
 * 
 * Sets up the testing environment with:
 * - React Testing Library for component testing
 * - Happy DOM for lightweight DOM simulation
 * - JSX support
 * - Module path aliases
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.js'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
