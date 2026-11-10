<script setup lang="ts">
import type { TutorialChapter, TutorialTrack } from '~/types'

const { step, track } = defineProps<{
  /** The chapter being read. */
  step: TutorialChapter
  /** Its track — drives the prev/next links. */
  track: TutorialTrack
}>()

const slugs = computed(() => track.chapters.map((chapter) => chapter.slug))
const surrounding = computed(() => stepSurroundings(slugs.value, step.slug))

const chapterUrl = (slug: string) => `/tutorial/${track.slug}/${slug}`
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto px-4 py-5">
      <h1 class="mb-3 text-xl font-semibold text-highlighted">
        {{ step.title }}
      </h1>
      <ContentRenderer
        v-if="step.body"
        :value="step"
        class="prose prose-sm max-w-none dark:prose-invert"
      />
    </div>

    <div
      class="flex items-center justify-between gap-2 border-t border-default px-4 py-2"
    >
      <UButton
        v-if="surrounding.prev"
        :to="chapterUrl(surrounding.prev)"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        Previous
      </UButton>
      <UButton
        v-else
        to="/tutorial"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        Overview
      </UButton>

      <UButton
        v-if="surrounding.next"
        :to="chapterUrl(surrounding.next)"
        trailing-icon="i-lucide-arrow-right"
        size="sm"
      >
        Next
      </UButton>
    </div>
  </div>
</template>
