import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/client',
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: {
        client: 'index.html'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.dev-story.shiyin.cyou',
        changeOrigin: true,
      },
    },
  },
})
