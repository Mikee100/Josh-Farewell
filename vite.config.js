import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    exclude: ['react-dom', 'react-router-dom']
  }
})

