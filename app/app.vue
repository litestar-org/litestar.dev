<script setup lang="ts">
import { joinURL } from 'ufo'

useHead({
  titleTemplate: (title) =>
    title
      ? `${title} · Litestar`
      : 'Litestar: The Modern Python ASGI Framework',
})

if (import.meta.server) {
  // public/ assets are served under the app baseURL in production (GitHub Pages
  // serves the site at /litestar.dev-v2/), but Vite serves them at root in dev.
  // Build the href per environment, otherwise the favicon 404s on the deploy.
  const baseURL = import.meta.dev ? '/' : useRuntimeConfig().app.baseURL
  const site = useSiteConfig()
  const route = useRoute()

  useHead({
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: joinURL(baseURL, 'logo.svg'),
      },
      // Raster fallbacks: link-preview crawlers and some browsers ignore SVG
      // icons and read /favicon.ico or the apple-touch-icon instead.
      { rel: 'icon', href: joinURL(baseURL, 'favicon.ico'), sizes: '48x48' },
      {
        rel: 'apple-touch-icon',
        href: joinURL(baseURL, 'apple-touch-icon.png'),
      },
    ],
  })
  useSeoMeta({
    ogSiteName: 'Litestar',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: 'LitestarAPI',
    // Canonical absolute URL — site.url is the host (no baseURL), app.baseURL
    // is the GH Pages subpath, route.path is the in-app route. joinURL collapses
    // duplicate slashes so the result is e.g. https://litestar-org.github.io/litestar.dev-v2/about.
    ogUrl: () => joinURL(site.url, baseURL, route.path),
  })
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
