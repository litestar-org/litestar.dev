<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  // Full-viewport layout: no footer, no page scroll, panes scroll internally.
  layout: 'tutorial',
})

const route = useRoute()
const trackSlug = computed(() => String(route.params.track))
const slug = computed(() => String(route.params.slug))

const { tracks } = await useTutorialChapters()

const track = computed(() =>
  tracks.value.find((candidate) => candidate.slug === trackSlug.value),
)

const step = computed(() =>
  track.value?.chapters.find((chapter) => chapter.slug === slug.value),
)

if (!step.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tutorial chapter not found',
    fatal: true,
  })
}

const stepFiles = useTutorialStepFiles()
const code = computed(
  () =>
    stepFiles[`${trackSlug.value}/${slug.value}`] ?? {
      files: {},
      solution: {},
    },
)

const title = computed(() => step.value!.title)
const description = computed(() => step.value!.description)

useSeoMeta({
  titleTemplate: '%s · Litestar tutorial',
  title,
  description,
  ogTitle: () => `${title.value} · Litestar tutorial`,
  ogDescription: description,
  twitterTitle: () => `${title.value} · Litestar tutorial`,
  twitterDescription: description,
})
</script>

<template>
  <div v-if="step && track" class="h-full">
    <USplitter
      :key="kebabCase(`${trackSlug}-${slug}`)"
      auto-save-id="litestar-tutorial"
      :items="[
        { slot: 'lesson', defaultSize: 42, minSize: 25 },
        { slot: 'workspace', minSize: 30 },
      ]"
      class="h-full bg-default"
      :ui="{
        handle:
          'border-e border-default transition-colors hover:border-primary data-[resize-handle-state=drag]:border-primary',
      }"
    >
      <template #lesson>
        <TutorialLesson :step="step" :track="track" />
      </template>

      <template #workspace>
        <ClientOnly>
          <TutorialWorkspace
            :step="`${trackSlug}/${slug}`"
            :files="code.files"
            :solution="code.solution"
            :requests="step.requests"
          />

          <template #fallback>
            <div class="flex h-full flex-col gap-3 p-4">
              <USkeleton class="h-6 w-40" />
              <USkeleton class="h-full w-full" />
            </div>
          </template>
        </ClientOnly>
      </template>
    </USplitter>
  </div>
</template>
