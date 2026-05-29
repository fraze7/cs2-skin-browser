import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/listings': {
        target: 'https://csfloat.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/listings/, '/api/v1/listings'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', process.env.VITE_CSFLOAT_API_KEY || '')
          })
        },
      },
    },
  },
})
