import { defineConfig } from 'vite'
import purgecss from '@fullhuman/postcss-purgecss'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  css: {
    postcss: {
      plugins: isProduction
        ? [
            purgecss({
              content: ['./index.html', './src/**/*.js'],
              safelist: {
                standard: [
                  'active',
                  'in-view',
                  'is-visible',
                  'expanded',
                  'collapsing',
                  'filling',
                  'returning',
                  'nav-open',
                  'slide-link-hidden',
                  'vanish-mode',
                  'show-link',
                ],
                deep: [/^data-/, /aria-/],
                greedy: [/carousel/, /cookie/],
              },
            }),
          ]
        : [],
    },
  },
})
