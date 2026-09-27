import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the Vercel serverless function (../api/listings.js) inside the Vite dev server,
// so `npm run dev` gets live data without needing `vercel dev` running alongside it.
function devApi(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      process.env.CSFLOAT_API_KEY ??= env.CSFLOAT_API_KEY
      server.middlewares.use('/api/listings', async (req, res) => {
        const { default: handler } = await import('../api/listings.js')
        const url = new URL(req.url, 'http://localhost')
        req.query = Object.fromEntries(url.searchParams)
        // Minimal shim for the Vercel/Express-style response helpers the handler uses
        res.status = code => { res.statusCode = code; return res }
        res.json = body => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        await handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix loads non-VITE_ vars too — the key stays server-side and never reaches the bundle
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), devApi(env)],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
    },
  }
})
