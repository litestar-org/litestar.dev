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

// Resolved once here: the toolbar and the lesson footer both link to them.
const surround = computed(() => {
  const slugs = track.value?.chapters.map((chapter) => chapter.slug) ?? []
  const { prev, next } = stepSurroundings(slugs, slug.value)

  return {
    prev: prev && chapterPath(trackSlug.value, prev),
    next: next && chapterPath(trackSlug.value, next),
  }
})

const stepKey = computed(() => `${trackSlug.value}/${slug.value}`)

const stepFiles = useTutorialStepFiles()
const code = computed(
  () => stepFiles[stepKey.value] ?? { files: {}, solution: {} },
)

// Owned here rather than inside the workspace: the toolbar and the editor sit
// on opposite sides of the splitter.
const session = useTutorialSession({
  step: () => stepKey.value,
  files: () => code.value.files,
  solution: () => code.value.solution,
  requests: () => step.value?.requests ?? [],
})

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
  <div v-if="step && track" class="flex h-full flex-col">
    <TutorialBar
      :chapter="step"
      :track="track"
      :prev="surround.prev"
      :next="surround.next"
      :running="session.running.value"
      :run-disabled="session.status.value === 'failed'"
      :has-solution="session.hasSolution.value"
      :showing-solution="session.showingSolution.value"
      @run="session.execute()"
      @reset="session.reset()"
      @toggle-solution="session.toggleSolution()"
    />

    <USplitter
      :key="kebabCase(stepKey)"
      auto-save-id="litestar-tutorial"
      :items="[
        { slot: 'lesson', defaultSize: 42, minSize: 25 },
        { slot: 'workspace', minSize: 30 },
      ]"
      class="min-h-0 flex-1 bg-default"
    >
      <template #lesson>
        <TutorialLesson
          :chapter="step"
          :prev="surround.prev"
          :next="surround.next"
        />
      </template>

      <template #workspace>
        <ClientOnly>
          <TutorialWorkspace :chapter-key="stepKey" :session="session" />

          <template #fallback>
            <div class="flex h-full w-full flex-col gap-3 p-4">
              <USkeleton class="h-6 w-40" />
              <USkeleton class="h-full w-full" />
            </div>
          </template>
        </ClientOnly>
      </template>
    </USplitter>
  </div>
</template>
