<script setup lang="ts">
import type { TutorialChapter, TutorialTrack } from '~/types'
import type { TutorialSession } from '~/composables/useTutorialSession'

const { step, track, session } = defineProps<{
  step: TutorialChapter
  track: TutorialTrack
  session: TutorialSession
}>()

const slugs = computed(() => track.chapters.map((chapter) => chapter.slug))
const surrounding = computed(() => stepSurroundings(slugs.value, step.slug))

const chapterUrl = (slug: string) => `/tutorial/${track.slug}/${slug}`
</script>

<template>
  <div class="flex items-center gap-2 border-b border-default px-3 py-1.5">
    <!-- Grouped tight and borderless so the three read as one control
         cluster rather than three separate widgets. -->
    <div class="flex items-center gap-0.5">
      <TutorialChapterMenu :track="track" :current="step.slug" />

      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="xs"
        square
        :to="surrounding.prev ? chapterUrl(surrounding.prev) : undefined"
        :disabled="!surrounding.prev"
        aria-label="Previous chapter"
      />
      <UButton
        icon="i-lucide-arrow-right"
        color="neutral"
        variant="ghost"
        size="xs"
        square
        :to="surrounding.next ? chapterUrl(surrounding.next) : undefined"
        :disabled="!surrounding.next"
        aria-label="Next chapter"
      />
    </div>

    <p class="truncate text-sm">
      <span class="text-muted">{{ step.section }}</span>
      <span class="mx-1.5 text-dimmed">/</span>
      <span class="font-medium text-highlighted">{{ step.title }}</span>
    </p>

    <div class="ms-auto flex items-center gap-1">
      <UButton
        icon="i-lucide-rotate-ccw"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="session.reset()"
      >
        Reset
      </UButton>
      <UButton
        v-if="session.hasSolution.value"
        :icon="
          session.showingSolution.value
            ? 'i-lucide-eye-off'
            : 'i-lucide-lightbulb'
        "
        color="neutral"
        variant="ghost"
        size="xs"
        @click="session.toggleSolution()"
      >
        {{ session.showingSolution.value ? 'Hide solution' : 'Solution' }}
      </UButton>
      <UButton
        icon="i-lucide-play"
        size="xs"
        :loading="session.running.value"
        :disabled="session.status.value === 'failed'"
        @click="session.execute()"
      >
        Run
      </UButton>
    </div>
  </div>
</template>
