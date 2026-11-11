<script setup lang="ts">
import type { TutorialChapter, TutorialTrack } from '~/types'

const {
  chapter,
  track,
  prev,
  next,
  running = false,
  runDisabled = false,
  hasSolution = false,
  showingSolution = false,
} = defineProps<{
  /** The chapter being read. */
  chapter: TutorialChapter
  /** Its track — listed in the chapter menu. */
  track: TutorialTrack
  /** URLs of the neighbouring chapters, when there are any. */
  prev?: string
  next?: string
  running?: boolean
  /** Python failed to start, so there is nothing to run the code with. */
  runDisabled?: boolean
  hasSolution?: boolean
  showingSolution?: boolean
}>()

const emit = defineEmits<{
  run: []
  reset: []
  toggleSolution: []
}>()
</script>

<template>
  <div class="flex items-center gap-2 border-b border-default px-3 py-1.5">
    <!-- Grouped tight and borderless so the three read as one control
         cluster rather than three separate widgets. -->
    <div class="flex items-center gap-0.5">
      <TutorialChapterMenu :track="track" :current="chapter.slug" />

      <UTooltip text="Previous chapter">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          :to="prev"
          :disabled="!prev"
          aria-label="Previous chapter"
        />
      </UTooltip>
      <UTooltip text="Next chapter">
        <UButton
          icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          :to="next"
          :disabled="!next"
          aria-label="Next chapter"
        />
      </UTooltip>
    </div>

    <p class="truncate text-sm">
      <span class="text-muted">{{ chapter.section }}</span>
      <span class="mx-1.5 text-dimmed">/</span>
      <span class="font-medium text-highlighted">{{ chapter.title }}</span>
    </p>

    <div class="ms-auto flex items-center gap-1">
      <UButton
        icon="i-lucide-rotate-ccw"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="emit('reset')"
      >
        Reset
      </UButton>
      <UButton
        v-if="hasSolution"
        :icon="showingSolution ? 'i-lucide-eye-off' : 'i-lucide-lightbulb'"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="emit('toggleSolution')"
      >
        {{ showingSolution ? 'Hide solution' : 'Solution' }}
      </UButton>
      <UButton
        icon="i-lucide-play"
        size="xs"
        :loading="running"
        :disabled="runDisabled"
        @click="emit('run')"
      >
        Run
      </UButton>
    </div>
  </div>
</template>
