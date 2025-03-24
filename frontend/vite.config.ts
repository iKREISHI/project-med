import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Адрес бэкенда
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@0_app": path.resolve(__dirname, "src/0_app"),
      "@1_pages": path.resolve(__dirname, "src/1_pages"),
      "@2_widgets": path.resolve(__dirname, "src/2_widgets"),
      "@4_features": path.resolve(__dirname, "src/4_features"),
      "@5_entities": path.resolve(__dirname, "src/5_entities"),
      "@6_shared": path.resolve(__dirname, "src/6_shared")
    },
  },
});
