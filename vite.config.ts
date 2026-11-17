import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'

/*
 * Content-Security-Policy для сборки. Всё своё: шрифт лежит в репозитории,
 * инлайн-скриптов нет, eval не нужен (zod работает в режиме jitless).
 * frame-ancestors в <meta> браузеры игнорируют — на хостинге продублировать заголовком
 * (см. README, «Готовность к продакшену»).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]
  .map((d) => `${d};`)
  // Точка с запятой и после последней директивы: антивирусы (Kaspersky) дописывают в meta
  // свои директивы без разделителя и ломают последнюю
  .join(' ')

function cspPlugin(): Plugin {
  return {
    name: 'epasluga-csp',
    apply: 'build',
    // Метку <!--csp--> меняем на meta сразу после charset и viewport — до любых скриптов
    transformIndexHtml(html) {
      return html.replace(
        '<!--csp-->',
        `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      )
    },
  }
}

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
    cspPlugin(),
    VitePWA({
      // Новая версия ставится только после согласия пользователя (тост «Обновить»)
      registerType: 'prompt',
      // Регистрируем сами в src/lib/pwa/registerServiceWorker.ts
      injectRegister: false,
      // favicon, apple-touch-icon и иконки манифеста попадают в precache через globPatterns ниже
      includeManifestIcons: false,
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
        // Сюда же попадают все ленивые чанки экранов (assets/*.js) и шрифт Onest (woff2)
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
        // Офлайн-фолбэк: любой переход внутри scope отдаёт закэшированный index.html
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Клик по уведомлению открывает нужный раздел
        importScripts: ['sw-notifications.js'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
})
