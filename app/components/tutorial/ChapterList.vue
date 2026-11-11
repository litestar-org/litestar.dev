<script setup lang="ts">
import type { TutorialChapter } from '~/types'

const { chapters, current } = defineProps<{
  /** One track's chapters, in reading order. */
  chapters: TutorialChapter[]
  /** Slug of the chapter being read, if any — highlighted in the list. */
  current?: string
}>()

const emit = defineEmits<{ select: [chapter: TutorialChapter] }>()

const sections = computed(() => groupBySection(chapters))
</script>

<template>
  <div class="flex flex-col gap-8">
    <section v-for="section of sections" :key="section.title">
      <h2 class="mb-1 text-xs font-medium text-dimmed">
        {{ section.title }}
      </h2>

      <ul class="divide-y divide-default border-y border-default">
        <li v-for="chapter of section.chapters" :key="chapter.slug">
          <NuxtLink
            :to="chapter.to"
            class="group flex items-center gap-4 py-3.5 transition-colors hover:bg-elevated/40"
            :aria-current="chapter.slug === current ? 'page' : undefined"
            @click="emit('select', chapter)"
          >
            <span class="min-w-0">
              <span
                class="block font-medium"
                :class="
                  chapter.slug === current ? 'text-primary' : 'text-highlighted'
                "
              >
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
    </section>
  </div>
</template>
