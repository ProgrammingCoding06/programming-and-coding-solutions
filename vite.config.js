import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgecss from '@fullhuman/postcss-purgecss'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  css: {
    minify: 'lightningcss',
    postcss: {
      plugins: isProduction
        ? [
            purgecss({
              content: ['./index.html', './privacy-policy.html', './src/**/*.{js,jsx}'],
              safelist: {
                standard: [
                  'in-view',
                  'is-pending',
                  'is-success',
                  'is-error',
                  'nav-locked',
                  'star-bg',
                  'stars',
                  'stars2',
                  'stars3',
                  'hero-logo-wrap',
                  'hint',
                  'hint-dot',
                  'hint-radius',
                  'hint-content',
                  'skill-open',
                  'skill-mobile-desc',
                  'policy-list',
                  'location-column',
                  'globe-loading',
                  'globe-wrap',
                  'location-address',
                  'skill-card',
                  'skill-card__dot',
                  'skill-card__inner',
                  'skill-card__ray',
                  'skill-card__label',
                  'skill-card__desc',
                  'skill-card__line',
                  'skill-card__line--top',
                  'skill-card__line--left',
                  'skill-card__line--bottom',
                  'skill-card__line--right',
                ],
                deep: [/^data-/, /aria-/, /^framer-rating/],
                greedy: [/carousel/, /cookie/],
              },
            }),
          ]
        : [],
    },
  },
})
