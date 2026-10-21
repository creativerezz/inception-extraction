import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3002,
    // The Bun API server (server/index.ts) holds provider keys; the browser only talks to /api.
    proxy: { '/api': 'http://localhost:3003' },
  },
})
