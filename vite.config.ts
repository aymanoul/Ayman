import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Static-export friendly SPA. Base is relative so the build can be hosted anywhere.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
