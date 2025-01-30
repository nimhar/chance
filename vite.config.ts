import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chance/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    middleware: [
      (req, res, next) => {
        if (req.url?.startsWith('/chance/') && !req.url.includes('.')) {
          req.url = '/chance/index.html';
        }
        next();
      },
    ],
  },
})
