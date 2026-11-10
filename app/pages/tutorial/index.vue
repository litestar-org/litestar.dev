<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-30 -z-10',
})

const { data: steps } = await useAsyncData('tutorial-index', () =>
  queryCollection('tutorial')
    .order('path', 'ASC')
    .select('path', 'title', 'description')
    .all(),
)

const chapters = computed(() =>
  (steps.value ?? []).flatMap((item) => {
    const slug = stepSlugFromPath(item.path)
    return slug ? [{ ...item, slug }] : []
  }),
)

const title = 'Litestar tutorial'
const description =
  'Learn Litestar one chapter at a time, writing and running real code in your browser.'

useSeoMeta({
  titleTemplate: '%s',
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
})
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <div class="max-w-2xl">
      <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
        {{ title }}
      </h1>
      <p class="mt-3 text-muted">{{ description }}</p>

      <ul class="mt-10 divide-y divide-default border-y border-default">
        <li v-for="chapter of chapters" :key="chapter.slug">
          <NuxtLink
            :to="`/tutorial/${chapter.slug}`"
            class="group flex items-center gap-4 py-4 transition-colors hover:bg-elevated/40"
          >
            <span class="min-w-0">
              <span class="block font-medium text-highlighted">
                {{ chapter.title }}
              </span>
              <span class="mt-0.5 block text-sm text-muted">
                {{ chapter.description }}
              </span>
            </span>

            <UIcon
              name="i-lucide-arrow-right"
              class="ms-auto size-4 shrink-0 text-dimmed transition-colors group-hover:text-primary"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </UContainer>
</template>
