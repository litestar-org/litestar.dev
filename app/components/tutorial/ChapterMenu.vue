<script setup lang="ts">
import type { TutorialTrack } from '~/types'

const { track, current } = defineProps<{
  track: TutorialTrack
  /** Slug of the chapter being read, highlighted in the list. */
  current: string
}>()
</script>

<template>
  <USlideover
    side="left"
    :title="track.title"
    :description="`${track.chapters.length} chapters`"
    :ui="{ content: 'max-w-sm' }"
  >
    <UTooltip text="Chapters">
      <UButton
        icon="i-lucide-list"
        color="neutral"
        variant="ghost"
        size="xs"
        square
        aria-label="Chapters"
      />
    </UTooltip>

    <template #body="{ close }">
      <nav aria-label="Chapters">
        <TutorialChapterList
          :chapters="track.chapters"
          :current="current"
          @select="close()"
        />
      </nav>
    </template>

    <template #footer="{ close }">
      <UButton
        to="/tutorial"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="w-full justify-start"
        @click="close()"
      >
        Tutorial overview
      </UButton>
    </template>
  </USlideover>
</template>
