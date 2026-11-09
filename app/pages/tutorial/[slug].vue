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

const { prev, next } = stepSurroundings(
  chapters.value.map((c) => c.slug),
  slug.value,
)

const position = computed(
  () => chapters.value.findIndex((c) => c.slug === slug.value) + 1,
)

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
        <div class="flex h-full flex-col">
          <div
            class="flex items-center gap-2 border-b border-default px-4 py-2"
          >
            <UBadge color="neutral" variant="subtle" size="sm">
              Step {{ position }} / {{ chapters.length }}
            </UBadge>
            <span class="truncate text-sm font-medium">{{ step.title }}</span>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-5">
            <h1 class="mb-3 text-xl font-semibold text-highlighted">
              {{ step.title }}
            </h1>
            <ContentRenderer
              v-if="step.body"
              :value="step"
              class="prose prose-sm max-w-none dark:prose-invert"
            />
          </div>

          <div
            class="flex items-center justify-between gap-2 border-t border-default px-4 py-2"
          >
            <UButton
              v-if="prev"
              :to="`/tutorial/${prev}`"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Previous
            </UButton>
            <UButton
              v-else
              to="/tutorial"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Overview
            </UButton>

            <UButton
              v-if="next"
              :to="`/tutorial/${next}`"
              trailing-icon="i-lucide-arrow-right"
              size="sm"
            >
              Next
            </UButton>
          </div>
        </div>
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
