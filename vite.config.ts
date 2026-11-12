import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const YEAR = 60 * 60 * 24 * 365

/*
 * base: './' + hash-роутер (createHashRouter):
 * сборка открывается из любой подпапки (GitHub Pages: /<repo>/) без 404.html-хаков.
 * Все пути в manifest и service worker — относительные, поэтому scope и start_url
 * совпадают с папкой, где лежит index.html.
 */
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Новая версия ставится только после согласия пользователя (тост «Обновить»)
      registerType: 'prompt',
      // Регистрируем сами в src/lib/pwa/registerServiceWorker.ts
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Е-Паслуга',
        short_name: 'Е-Паслуга',
        description:
          'Личный кабинет гражданина: услуги, заявления, документы и семейные платежи «Далонь».',
        lang: 'ru',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#ffffff',
        background_color: '#f3f4f8',
        categories: ['government', 'utilities', 'finance'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Далонь — платежи семьи',
            short_name: 'Далонь',
            description: 'Начисления, сроки и оплата за всю семью',
            url: './#/family',
            icons: [{ src: 'icons/shortcut-dalon-96.png', sizes: '96x96', type: 'image/png' }],
          },
          {
            name: 'Мои услуги',
            short_name: 'Мои услуги',
            description: 'Заявления и их статусы',
            url: './#/profile?tab=apps',
            icons: [{ src: 'icons/shortcut-apps-96.png', sizes: '96x96', type: 'image/png' }],
          },
          {
            name: 'Поиск услуг',
            short_name: 'Поиск',
            description: 'Найти услугу своими словами',
            url: './#/catalog?view=list',
            icons: [{ src: 'icons/shortcut-search-96.png', sizes: '96x96', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // Оболочка приложения целиком: после первого визита открывается без сети
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Воркер msw нужен только для разработки — в кэш не кладём
        globIgnores: ['**/mockServiceWorker.js'],
        // Офлайн-фолбэк: любой переход внутри scope отдаёт закэшированный index.html
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Клик по уведомлению открывает нужный раздел
        importScripts: ['sw-notifications.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxEntries: 10, maxAgeSeconds: YEAR },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 30, maxAgeSeconds: YEAR },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
})
