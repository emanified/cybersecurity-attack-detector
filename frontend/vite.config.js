import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
  server: {
    proxy: {
      '/scan': 'http://localhost:5001',
      '/dfa': 'http://localhost:5001',
    }
  }
})
