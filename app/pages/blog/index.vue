<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70 -z-10',
})
const { fetchList, articles } = useBlog()
const { enrichArticlesWithImages } = useBlogImages()

const page = {
  title: 'Litestar Blog',
  description: 'Read the latest news about Litestar ecosystem',
}

useSeoMeta({
  titleTemplate: '%s',
  title: page.title,
  description: page.description,
  ogDescription: page.description,
  ogTitle: page.title,
  twitterTitle: page.title,
  twitterDescription: page.description,
})

// Listing's own social card. Called first so it claims the default 'og' key
// and stays the primary <meta property="og:image"> on this page.
defineOgImage('Page', {
  title: page.title,
  description: page.description,
})

await fetchList()

// Per-article OG paths via the same public API the post page uses — so the
// URLs match the prerendered files (the hash drops _path before computing:
// node_modules/nuxt-og-image/dist/runtime/shared/urlEncoding.js:97). Distinct
// keys keep each call as its own payload entry instead of overwriting the
// 'Page' card or earlier per-article entries (utils.js:67-77). useAsyncData
// (not useState) because its result lands in the extracted /blog/_payload.json:
// client-side navigations never re-run defineOgImage (it returns [] outside
// SSR; _defineOgImageRaw.js:19-20), so the paths must ride the payload on both
// entry modes — hard load AND in-app navigation.
const { data: blogOgPaths } = await useAsyncData<string[]>(
  'blog-og-paths',
  () =>
    Promise.resolve(
      import.meta.server
        ? defineOgImage(
            'Blog',
            (articles.value || []).map((article, i) => ({
              props: {
                blog: { title: article.title, category: article.category },
              },
              key: `blog-${i}`,
            })),
          )
        : [],
    ),
)

const articlesWithImages = computed(() =>
  enrichArticlesWithImages(articles.value || [], blogOgPaths.value ?? []),
)
</script>

<template>
  <UContainer>
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
    >
    </UPageHero>

    <UPageBody>
      <UContainer>
        <UBlogPosts class="mb-12 md:grid-cols-2 lg:grid-cols-3">
          <UBlogPost
            v-for="(article, index) in articlesWithImages"
            :key="article.path"
            :to="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDateByLocale('en', article.date)"
            :authors="
              article.authors.map((author) => ({
                ...author,
                avatar: { ...author.avatar, alt: `${author.name} avatar` },
              }))
            "
            :badge="{
              label: article.category,
              color: 'primary',
              variant: 'subtle',
            }"
            :variant="index === 0 ? 'outline' : 'subtle'"
            :orientation="index === 0 ? 'horizontal' : 'vertical'"
            :class="[index === 0 && 'col-span-full']"
          >
            <template #header="{ ui }">
              <!--
                Generated OG images are produced during prerender, so IPX has no
                source file to optimize when this listing builds first — reference
                them directly. Real frontmatter images keep <NuxtImg> optimization.
              -->
              <NuxtImg
                v-if="!article.image?.includes('/_og/')"
                :src="article.image"
                :alt="`${article.title} image`"
                :width="index === 0 ? 672 : 437"
                :height="index === 0 ? 378 : 246"
                :sizes="
                  index === 0 ? '100vw md:672px' : '100vw sm:50vw lg:437px'
                "
                format="webp"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :class="ui.image()"
              />
              <img
                v-else
                :src="article.image"
                :alt="`${article.title} image`"
                :width="index === 0 ? 672 : 437"
                :height="index === 0 ? 378 : 246"
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
                :class="ui.image()"
              />
            </template>
          </UBlogPost>
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UContainer>
</template>
