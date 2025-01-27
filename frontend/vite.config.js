import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    https: true, // Enables HTTPS
    proxy: {
      '/api': {
        target: 'https://e-voting-platform.onrender.com', // Backend server
        changeOrigin: true,
        secure: false, // Set to true if your backend uses a trusted certificate
      },
    },
  },
});
