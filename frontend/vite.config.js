import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy API requests to the backend PHP server running on port 8000
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Do not rewrite; backend is expected to be served with `backend` as docroot
      }
    }
  }
})
