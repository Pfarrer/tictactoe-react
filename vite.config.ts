import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    globals: true,
  },
} as UserConfig);
