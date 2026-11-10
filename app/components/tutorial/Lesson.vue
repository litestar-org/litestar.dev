<script setup lang="ts">
import type { TutorialChapter } from '~/types'

const { step, chapters } = defineProps<{
  /** The chapter being read. */
  step: TutorialChapter
  /** Every chapter, in order — drives the switcher and the prev/next links. */
  chapters: TutorialChapter[]
}>()

const slugs = computed(() => chapters.map((chapter) => chapter.slug))

const surrounding = computed(() => stepSurroundings(slugs.value, step.slug))
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-2 border-b border-default px-4 py-2">
      <!-- Grouped tight and borderless so the three read as one control
           cluster rather than three separate widgets. -->
      <div class="flex items-center gap-0.5">
        <TutorialChapterMenu :chapters="chapters" :current="step.slug" />

        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          :to="surrounding.prev ? `/tutorial/${surrounding.prev}` : undefined"
          :disabled="!surrounding.prev"
          aria-label="Previous chapter"
        />
        <UButton
          icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          :to="surrounding.next ? `/tutorial/${surrounding.next}` : undefined"
          :disabled="!surrounding.next"
          aria-label="Next chapter"
        />
      </div>

      <p class="truncate text-sm">
        <span class="text-muted">{{ step.section }}</span>
        <span class="mx-1.5 text-dimmed">/</span>
        <span class="font-medium text-highlighted">{{ step.title }}</span>
      </p>
    </div>

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
        :to="`/tutorial/${surrounding.prev}`"
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
        :to="`/tutorial/${surrounding.next}`"
        trailing-icon="i-lucide-arrow-right"
        size="sm"
      >
        Next
      </UButton>
    </div>
  </div>
</template>
