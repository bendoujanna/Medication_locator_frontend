import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {

            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-map';
            }
            // Group React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
})