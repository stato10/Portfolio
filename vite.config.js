import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const portfolioBaseRedirect = {
  name: 'portfolio-base-redirect',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const [pathname, query] = (request.url || '').split('?')

      if (pathname === '/portfolio') {
        request.url = `/portfolio/${query ? `?${query}` : ''}`
      }

      next()
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [portfolioBaseRedirect, react()],
  base: '/portfolio/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: '/portfolio/',
  }
})
