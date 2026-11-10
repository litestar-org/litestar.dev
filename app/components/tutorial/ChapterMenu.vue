<script setup lang="ts">
import type { TutorialChapter, TutorialTrack } from '~/types'

const { track, current } = defineProps<{
  track: TutorialTrack
  /** Slug of the chapter being read, marked and highlighted in the list. */
  current: string
}>()

/**
 * Chapters grouped under their section heading.
 *
 * Grouping is consecutive rather than by lookup, so a section that appears
 * twice in a track stays two groups instead of being silently merged.
 */
const sections = computed(() => {
  const groups: { title: string; chapters: TutorialChapter[] }[] = []

  for (const chapter of track.chapters) {
    const last = groups.at(-1)
    if (last?.title === chapter.section) last.chapters.push(chapter)
    else groups.push({ title: chapter.section, chapters: [chapter] })
  }

  return groups
})
</script>

<template>
  <USlideover
    side="left"
    :title="track.title"
    :description="`${track.chapters.length} chapters`"
    :ui="{ content: 'max-w-sm' }"
  >
    <UButton
      icon="i-lucide-list"
      color="neutral"
      variant="ghost"
      size="xs"
      square
      aria-label="Chapters"
    />

    <template #body="{ close }">
      <nav class="flex flex-col gap-5">
        <div v-for="section of sections" :key="section.title">
          <p class="px-3 pb-1 text-xs font-medium text-dimmed">
            {{ section.title }}
          </p>

          <ul>
            <li v-for="chapter of section.chapters" :key="chapter.slug">
              <NuxtLink
                :to="`/tutorial/${track.slug}/${chapter.slug}`"
                class="block rounded-lg px-3 py-2 transition-colors"
                :class="
                  chapter.slug === current
                    ? 'bg-elevated'
                    : 'hover:bg-elevated/50'
                "
                :aria-current="chapter.slug === current ? 'page' : undefined"
                @click="close()"
              >
                <span
                  class="block text-sm"
                  :class="
                    chapter.slug === current
                      ? 'font-medium text-primary'
                      : 'font-medium text-highlighted'
                  "
                >
                  {{ chapter.title }}
                </span>
                <span class="block text-xs text-muted">
                  {{ chapter.teaches }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
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
