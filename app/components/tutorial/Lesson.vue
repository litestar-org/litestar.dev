<script setup lang="ts">
import type { TutorialChapter } from '~/types'

const { chapter, prev, next } = defineProps<{
  /** The chapter being read. */
  chapter: TutorialChapter
  /** URLs of the neighbouring chapters, when there are any. */
  prev?: string
  next?: string
}>()
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto px-4 py-5">
      <h1 class="mb-3 text-xl font-semibold text-highlighted">
        {{ chapter.title }}
      </h1>
      <ContentRenderer v-if="chapter.body" :value="chapter" />

      <!-- Chapters are plain markdown in the site's repo, so a typo is one
           click from a pull request. -->
      <div
        class="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-default pt-4 text-sm text-muted"
      >
        <span>Spotted a mistake?</span>
        <UButton
          :to="chapterEditUrl(chapter.stem)"
          target="_blank"
          icon="i-lucide-pencil"
          color="neutral"
          variant="link"
          size="sm"
          class="p-0"
        >
          Edit this page
        </UButton>
        <UButton
          :to="chapterIssueUrl(chapter)"
          target="_blank"
          icon="i-lucide-bug"
          color="neutral"
          variant="link"
          size="sm"
          class="p-0"
        >
          Report an issue
        </UButton>
      </div>
    </div>

    <div
      class="flex items-center justify-between gap-2 border-t border-default px-4 py-2"
    >
      <UButton
        :to="prev ?? '/tutorial'"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        {{ prev ? 'Previous' : 'Overview' }}
      </UButton>

      <UButton
        v-if="next"
        :to="next"
        trailing-icon="i-lucide-arrow-right"
        size="sm"
      >
        Next
      </UButton>
    </div>
  </div>
</template>
