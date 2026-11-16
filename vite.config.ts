import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*.png', 'icons/*.svg'],
    manifest: {
      id: './', name: 'AI STUDY 14｜生成AIアドバイザー1級 学習ノート', short_name: 'AI STUDY',
      description: '14日間で学ぶ生成AIの基礎。講義・テスト・復習をオフラインでも。',
      lang: 'ja', start_url: './', scope: './', display: 'standalone',
      background_color: '#f4f7fb', theme_color: '#172e55',
      icons: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: { clientsClaim: true, globPatterns: ['**/*.{js,css,html,png,svg,json,webmanifest}'], cleanupOutdatedCaches: true, navigateFallback: 'index.html' }
  })],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', include: ['src/**/*.test.{ts,tsx}'], restoreMocks: true }
})
