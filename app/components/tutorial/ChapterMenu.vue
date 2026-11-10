<script setup lang="ts">
import type { TutorialChapter } from '~/types'

const { chapters, current } = defineProps<{
  chapters: TutorialChapter[]
  /** Slug of the chapter being read, marked and highlighted in the list. */
  current: string
}>()
</script>

<template>
  <USlideover
    side="left"
    title="Chapters"
    description="Jump to any chapter of the tutorial."
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
      <nav>
        <ul class="flex flex-col gap-1">
          <li v-for="(chapter, index) of chapters" :key="chapter.slug">
            <NuxtLink
              :to="`/tutorial/${chapter.slug}`"
              class="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors"
              :class="
                chapter.slug === current
                  ? 'bg-elevated'
                  : 'hover:bg-elevated/50'
              "
              :aria-current="chapter.slug === current ? 'page' : undefined"
              @click="close()"
            >
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                :class="
                  chapter.slug === current
                    ? 'bg-primary text-inverted'
                    : 'bg-elevated text-muted'
                "
              >
                {{ index + 1 }}
              </span>

              <span class="min-w-0">
                <span class="block text-sm font-medium text-highlighted">
                  {{ chapter.title }}
                </span>
                <span class="block text-xs text-muted">
                  {{ chapter.teaches }}
                </span>
              </span>
            </NuxtLink>
          </li>
        </ul>
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
