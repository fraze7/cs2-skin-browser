import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/csfloat-api': {
        target: 'https://csfloat.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/csfloat-api/, '/api'),
      },
    },
  },
})
