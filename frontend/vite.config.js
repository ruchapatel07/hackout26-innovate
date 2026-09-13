import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
=======
    host: true,
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5005',
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
        changeOrigin: true,
        secure: false
      }
    }
  }
});
