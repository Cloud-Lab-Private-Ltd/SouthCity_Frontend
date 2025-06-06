import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true,
    port: 3003
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['canvg']
  }
});
