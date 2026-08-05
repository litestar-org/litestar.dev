import { createResolver } from 'nuxt/kit'
import { parseMdc } from './helpers/mdc-parser.mjs'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      // @nuxtjs/robots owns the `/robots.txt` route, so it's not listed here.
      routes: ['/sitemap.xml'],
    },
    logLevel: 5,
  },
  logLevel: 'verbose',
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      documentationUrl: 'https://docs.litestar.dev/latest/',
      githubUrl: 'https://github.com/litestar-org/litestar',
      discordUrl: 'https://discord.gg/litestar',
      pypiUrl: 'https://pypi.org/project/litestar/',
      sponsorUrl: 'https://github.com/sponsors/litestar-org',
      contributorsUrl:
        'https://github.com/litestar-org/litestar/graphs/contributors',
      issuesUrl: 'https://github.com/litestar-org/litestar/issues/new',
      discussionsUrl: 'https://github.com/litestar-org/litestar/discussions',
      pullRequestsUrl: 'https://github.com/litestar-org/litestar/pulls',
      contributingUrl:
        'https://github.com/litestar-org/litestar/blob/main/CONTRIBUTING.rst',
    },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    'nuxt-content-twoslash',
    '@nuxt/image',
    // <meta robots> tags + robots.txt (see `robots` config).
    '@nuxtjs/robots',
    // Must load BEFORE @nuxt/content: the sitemap↔content integration registers a
    // `content:file:afterParse` hook that bakes per-document sitemap data into the
    // content DB at build time. Loaded after content, the hook isn't wired and
    // dynamic blog/plugin URLs go missing from the sitemap (the module even warns
    // about this exact ordering).
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@nuxtjs/mdc',
    '@nuxt/fonts',
    'nuxt-og-image',
    // JSON-LD structured data (Organization/WebSite/WebPage — see `schemaOrg`).
    'nuxt-schema-org',
    'motion-v/nuxt',
    'nuxt-ai-ready',
    '@nuxtjs/google-fonts',
    '@nuxtjs/html-validator',
    // Build-time scan for broken internal links (see `linkChecker` config).
    'nuxt-link-checker',
  ],
  // Dev-time advisory only: surface markup issues without failing the build.
  htmlValidator: {
    failOnError: false,
    options: {
      rules: {
        // Noise from @nuxt/ui component internals (USelectMenu/UInput render
        // <label>/<input>/<div> structures we don't control; UPageCard/UPageHero
        // heading nesting; Shiki injects <style> in code blocks):
        'element-permitted-content': 'off',
        'input-missing-label': 'off',
        'multiple-labeled-controls': 'off',
        'heading-level': 'off',
        'no-dup-class': 'off',
        // Noise from third-party plugin README HTML (GitHub markdown):
        'attribute-allowed-values': 'off',
        'wcag/h63': 'off',
        'no-deprecated-attr': 'off',
        'prefer-native-element': 'off',
        // Soft SEO guideline; our blog titles are descriptive and the
        // " · Litestar Blog" suffix tips them over 70 chars.
        'long-title': 'off',
      },
    },
  },
  sitemap: {
    // Static site: build the sitemap at build time. Dynamic URLs (blog posts,
    // plugin pages) are sourced from prerendered routes during `generate`, so
    // the dev sitemap only lists static routes — the deployed one is complete.
    zeroRuntime: true,
  },
  robots: {
    // robots.txt only works at a domain root; under the /litestar.dev-v2/ subpath
    // crawlers ignore it and the module errors. Meta tags apply either way.
    robotsTxt: (process.env.NUXT_APP_BASE_URL || '/') === '/',
    credits: false,
  },
  linkChecker: {
    // Fail CI on broken internal links (warnings don't fail the build).
    failOnError: true,
    // Plugin category filters use capitalized query values (?category=UI) — not broken.
    skipInspections: ['no-uppercase-chars'],
  },
  schemaOrg: {
    // Site-wide identity → auto-generates the Organization + WebSite JSON-LD nodes.
    identity: {
      type: 'Organization',
      name: 'Litestar',
      logo: '/logo.svg',
      sameAs: [
        'https://github.com/litestar-org',
        'https://x.com/LitestarAPI',
        'https://discord.gg/litestar',
      ],
    },
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://litestar.dev',
    name: 'Litestar',
  },
  $development: {
    site: {
      url: 'http://localhost:3000',
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  // OG images source their fonts from @nuxt/fonts in v6 (the old
  // `ogImage.fonts` option was removed). `global: true` is required so the
  // @font-face is globally emitted — OG images can't read Tailwind v4 @theme.
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700],
        global: true,
      },
    ],
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
  app: {
    // '/' for the litestar.dev custom domain on GitHub Pages. NUXT_APP_BASE_URL
    // still allows a subpath deploy (e.g. a project-site preview) without code changes.
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Litestar',
    },
    pageTransition: false,
    layoutTransition: false,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      // Pre-bundle Vue Flow (used by the architecture diagram) so Vite doesn't
      // discover it at runtime and trigger a dev page reload on first visit.
      include: ['@vue-flow/core', '@vue-flow/background'],
    },
  },
  experimental: {
    extractAsyncDataHandlers: true,
    viteEnvironmentApi: true,
  },
  ui: {
    experimental: {
      componentDetection: true,
    },
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          // Add remark-gfm
          'remark-gfm': {},
        },
        highlight: {
          theme: {
            default: 'material-theme-lighter',
            dark: 'material-theme-palenight',
          },
          langs: [
            'sql',
            'diff',
            'ini',
            'python',
            'toml',
            'shell',
            'js',
            'typescript',
            'vue',
          ],
        },
      },
    },
  },
  hooks: {
    'content:file:afterParse': async ({ file, content }) => {
      if (file.id === 'index/index.yml') {
        // @ts-expect-error -- TODO: fix this
        for (const tab of content.hero.tabs) {
          tab.content = await parseMdc(tab.content)
        }
        // @ts-expect-error -- TODO: fix this
        delete content.meta.body
      }

      // Drop the README's leading <h1> so it doesn't duplicate <UPageHeader>'s title on /plugins/<slug>.
      if (file.id?.startsWith('readme/')) {
        // @ts-expect-error -- meta.body is the minimark AST for data .md files
        const root = content?.meta?.body?.value
        const stripFirstH1 = (parent: unknown[], start: number): boolean => {
          for (let i = start; i < parent.length; i++) {
            const node = parent[i]
            if (!Array.isArray(node)) continue
            const tag = node[0]
            if (typeof tag === 'string' && /^h[1-6]$/.test(tag)) {
              if (tag === 'h1') parent.splice(i, 1)
              return true
            }
            if (stripFirstH1(node as unknown[], 2)) return true
          }
          return false
        }
        if (Array.isArray(root)) stripFirstH1(root, 0)
      }
    },
  },
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: resolve('./app/assets/icons'),
      },
    ],
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    provider: 'iconify',
  },
  twoslash: {
    floatingVueOptions: {
      classMarkdown: 'prose prose-primary dark:prose-invert',
    },
    // Skip Twoslash in dev to improve performance. Turn this on when you want to explicitly test twoslash in dev.
    enableInDev: false,
    // Do not throw when twoslash fails, the typecheck should be down in github.com/nuxt/nuxt's CI
    throws: false,
  },
})
