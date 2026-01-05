import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ethers-vendor': ['ethers'],
          'framer-vendor': ['framer-motion']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  base: './',
  optimizeDeps: {
    include: ['ethers']
  }
})