<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  // Full-viewport layout: no footer, no page scroll, panes scroll internally.
  layout: 'tutorial',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: steps } = await useAsyncData('tutorial-steps', () =>
  queryCollection('tutorial').order('path', 'ASC').all(),
)

const chapters = computed(() =>
  (steps.value ?? []).flatMap((item) => {
    const stepSlug = stepSlugFromPath(item.path)
    return stepSlug ? [{ ...item, slug: stepSlug }] : []
  }),
)

const step = computed(() => chapters.value.find((c) => c.slug === slug.value))

if (!step.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tutorial step not found',
    fatal: true,
  })
}

const stepFiles = useTutorialStepFiles()
const code = computed(
  () => stepFiles[slug.value] ?? { files: {}, solution: {} },
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
  <div v-if="step" class="h-full">
    <USplitter
      :key="kebabCase(slug)"
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
        <TutorialLesson :step="step" :chapters="chapters" />
      </template>

      <template #workspace>
        <ClientOnly>
          <TutorialWorkspace
            :step="slug"
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
