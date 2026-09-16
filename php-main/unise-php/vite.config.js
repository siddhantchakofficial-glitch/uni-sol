import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'i18next': path.resolve(__dirname, 'src/i18n-engine.js'),
      'react-i18next': path.resolve(__dirname, 'src/i18n-engine.js'),
      'i18next-browser-languagedetector': path.resolve(__dirname, 'src/i18n-engine.js'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
