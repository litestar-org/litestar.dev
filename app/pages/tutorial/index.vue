<script setup lang="ts">
import type { TutorialChapter } from '~/types'

definePageMeta({
  heroBackground: 'opacity-30 -z-10',
})

const [{ data: page }, { tracks }] = await Promise.all([
  useAsyncData('tutorial-page', () => queryCollection('tutorialPage').first()),
  useTutorialChapters(),
])

const hero = computed(() => page.value?.hero)

const selected = ref(tracks.value[0]?.slug ?? '')
const track = computed(() =>
  tracks.value.find((candidate) => candidate.slug === selected.value),
)

/** First chapter of the first track that has any — where the CTA goes. */
const start = computed(() => {
  for (const candidate of tracks.value) {
    const first = candidate.chapters[0]
    if (first) return `/tutorial/${candidate.slug}/${first.slug}`
  }
  return undefined
})

/** Chapters of the selected track, grouped under their section heading. */
const sections = computed(() => {
  const groups: { title: string; chapters: TutorialChapter[] }[] = []

  for (const chapter of track.value?.chapters ?? []) {
    const last = groups.at(-1)
    if (last?.title === chapter.section) last.chapters.push(chapter)
    else groups.push({ title: chapter.section, chapters: [chapter] })
  }

  return groups
})

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
  <UContainer v-if="hero" class="py-14 sm:py-20">
    <div class="grid gap-12 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-16">
      <div class="max-w-xl">
        <h1
          class="text-4xl leading-[1.05] font-semibold tracking-tight text-highlighted sm:text-5xl"
        >
          {{ hero.title }}
        </h1>

        <p class="mt-5 text-lg text-muted">{{ hero.description }}</p>

        <div class="mt-8">
          <UButton
            v-if="start"
            :to="start"
            size="xl"
            trailing-icon="i-lucide-arrow-right"
          >
            {{ hero.cta }}
          </UButton>
        </div>

        <p class="mt-5 max-w-md text-sm text-dimmed">{{ hero.note }}</p>
      </div>

      <!-- The product's own vocabulary: a handler and the response it returns.
           Static markup — this page pulls no Python runtime. -->
      <div
        class="overflow-hidden rounded-xl border border-default bg-default shadow-sm"
      >
        <MDC
          :value="hero.snippet"
          class="[&_pre]:!my-0 [&_pre]:rounded-none [&_pre]:border-0 [&>div]:my-0"
        />

        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-default px-4 py-3"
        >
          <UBadge color="success" variant="subtle" size="sm">
            {{ hero.response.status }}
          </UBadge>
          <span class="font-mono text-xs text-muted">
            {{ hero.response.request }}
          </span>
          <span class="font-mono text-xs text-highlighted">
            {{ hero.response.body }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-16 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <!-- Tracks. Selecting one swaps the chapter list beside it rather than
           navigating, so comparing tracks costs nothing. -->
      <nav aria-label="Tracks">
        <ul class="flex flex-col gap-1">
          <li v-for="candidate of tracks" :key="candidate.slug">
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2 text-start text-sm transition-colors"
              :class="
                candidate.slug === selected
                  ? 'bg-elevated font-medium text-highlighted'
                  : 'text-muted hover:bg-elevated/50 hover:text-highlighted'
              "
              :aria-pressed="candidate.slug === selected"
              @click="selected = candidate.slug"
            >
              {{ candidate.title }}
              <span class="ms-1 text-xs text-dimmed">
                {{ candidate.chapters.length }}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div v-if="track" class="max-w-2xl">
        <div
          v-for="section of sections"
          :key="section.title"
          class="mb-8 last:mb-0"
        >
          <h2 class="mb-1 text-xs font-medium text-dimmed">
            {{ section.title }}
          </h2>

          <ul class="divide-y divide-default border-y border-default">
            <li v-for="chapter of section.chapters" :key="chapter.slug">
              <NuxtLink
                :to="`/tutorial/${track.slug}/${chapter.slug}`"
                class="group flex items-center gap-4 py-3.5 transition-colors hover:bg-elevated/40"
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

        <!-- A track can exist before anything is written for it. -->
        <p
          v-if="!sections.length"
          class="rounded-lg border border-dashed border-default px-4 py-8 text-center text-sm text-muted"
        >
          {{ track.description }}
          <span class="mt-1 block text-dimmed">Chapters coming soon.</span>
        </p>
      </div>
    </div>
  </UContainer>
</template>
