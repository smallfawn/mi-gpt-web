import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3344',
        /*changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')*/
      }
    }

  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
