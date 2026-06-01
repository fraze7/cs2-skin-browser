import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
          proxy: {
                  // In development, proxy /api/listings to the local Vercel dev server (port 3000).
            // Run `vercel dev` (not `npm run dev`) to use the real serverless function locally.
            // With plain `npm run dev`, API calls will fail unless vercel dev is also running.
            '/api': {
                      target: 'http://localhost:3000',
                      changeOrigin: true,
            },
          },
    },
})
