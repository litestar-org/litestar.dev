<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-30 -z-10',
})

const [{ data: page }, { tracks }] = await Promise.all([
  useAsyncData('tutorial-page', () => queryCollection('tutorialPage').first()),
  useTutorialChapters(),
])

const hero = computed(() => page.value?.hero)

const tabs = computed(() =>
  tracks.value.map((track) => ({
    label: track.title,
    value: track.slug,
    badge: track.chapters.length,
    track,
  })),
)

/** First chapter of the first track that has any — where the CTA goes. */
const start = computed(
  () => tracks.value.find((track) => track.chapters.length)?.chapters[0]?.to,
)

const title = computed(() => hero.value?.title ?? 'Litestar tutorial')
const description = computed(() => hero.value?.description ?? '')

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
  <div v-if="hero">
    <TutorialHero :hero="hero" :start="start" />

    <UContainer class="pb-14 sm:pb-20">
      <!-- Selecting a track swaps the chapter list beside it rather than
           navigating, so comparing tracks costs nothing.

           `unmount-on-hide` is off so every track's list stays in the markup:
           `crawlLinks` only prerenders what it can find there, and swapping
           lists on click would leave every non-default track's chapters
           unbuilt — and 404 on a static host. -->
      <UTabs
        :items="tabs"
        :default-value="tabs[0]?.value"
        orientation="vertical"
        variant="link"
        :unmount-on-hide="false"
        :ui="{
          root: 'flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-12',
          list: 'lg:sticky lg:top-[calc(var(--ui-header-height)+1.5rem)] lg:w-56 lg:shrink-0',
          trigger: 'justify-between',
          content: 'min-w-0 flex-1',
        }"
      >
        <template #content="{ item }">
          <p class="mb-8 text-muted">{{ item.track.description }}</p>

          <TutorialChapterList
            v-if="item.track.chapters.length"
            :chapters="item.track.chapters"
          />

          <!-- A track can exist before anything is written for it. -->
          <UEmpty
            v-else
            variant="outline"
            icon="i-lucide-pencil-line"
            title="Chapters coming soon"
            description="This track is still being written."
          />
        </template>
      </UTabs>
    </UContainer>
  </div>
</template>
