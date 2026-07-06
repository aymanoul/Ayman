import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Static-export friendly SPA. Base is relative so the build can be hosted anywhere.
// PWA: Precache des kompletten App-Shells (JS/CSS/Fonts/Bilder) — die 9 Bücher
// stecken im Bundle, damit ist die GANZE Bibliothek inkl. Suche und
// Antwort-Engine offline nutzbar. autoUpdate versioniert den Service Worker
// bei jedem Build und aktualisiert Clients automatisch.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // Registrierung passiert manuell (Offline-Schalter)
      manifest: {
        name: 'Die Bibliothek',
        short_name: 'Bibliothek',
        description:
          'Der versiegelte Nektar — eine Buchreihe mit neun Büchern. Vollständig offline lesbar.',
        lang: 'de',
        dir: 'ltr',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        background_color: '#f4ecdb',
        theme_color: '#f4ecdb',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,otf,webmanifest}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
