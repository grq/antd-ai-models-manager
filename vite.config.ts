import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log(process.env)

export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_PORT ?? '0', 10) || 3332
  },
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})