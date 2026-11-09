<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-30 -z-10',
})

const [{ data: page }, { data: steps }] = await Promise.all([
  useAsyncData('tutorial-page', () => queryCollection('tutorialPage').first()),
  useAsyncData('tutorial-index', () =>
    queryCollection('tutorial')
      .order('path', 'ASC')
      .select('path', 'title', 'teaches', 'requests')
      .all(),
  ),
])

const chapters = computed(() =>
  (steps.value ?? []).flatMap((item) => {
    const slug = stepSlugFromPath(item.path)
    if (!slug) return []

    // The endpoint comes from the step's own requests, so the overview can't
    // advertise a route the step doesn't actually run.
    const first = item.requests?.[0]

    return [
      {
        ...item,
        slug,
        method: first?.method ?? 'GET',
        path: first?.path ?? '/',
      },
    ]
  }),
)

const first = computed(() => chapters.value[0])
const hero = computed(() => page.value?.hero)

const title = computed(() => hero.value?.title ?? 'Litestar tutorial')
const description = computed(() => hero.value?.description ?? '')

useSeoMeta({
  titleTemplate: '%s',
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
})
</script>

<template>
  <UContainer v-if="hero" class="py-14 sm:py-20">
    <div class="grid gap-12 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-16">
      <div class="max-w-xl">
        <h1
          class="text-4xl leading-[1.05] font-semibold tracking-tight text-highlighted sm:text-5xl"
        >
          {{ hero.title }}
        </h1>

        <p class="mt-5 text-lg text-muted">
          {{ hero.description }}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <UButton
            v-if="first"
            :to="`/tutorial/${first.slug}`"
            size="xl"
            trailing-icon="i-lucide-arrow-right"
          >
            {{ hero.cta }}
          </UButton>
          <span class="text-sm text-muted">
            {{ chapters.length }} steps, no account needed
          </span>
        </div>

        <p class="mt-5 max-w-md text-sm text-dimmed">{{ hero.note }}</p>
      </div>

      <!-- The product's own vocabulary: a handler and the response it returns.
           Static markup — this page pulls no Python runtime. -->
      <div
        class="overflow-hidden rounded-xl border border-default bg-default shadow-sm"
      >
        <MDC
          :value="hero.snippet"
          class="[&_pre]:!my-0 [&_pre]:rounded-none [&_pre]:border-0 [&>div]:my-0"
        />

        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-default px-4 py-3"
        >
          <UBadge color="success" variant="subtle" size="sm">
            {{ hero.response.status }}
          </UBadge>
          <span class="font-mono text-xs text-muted">
            {{ hero.response.request }}
          </span>
          <span class="font-mono text-xs text-highlighted">
            {{ hero.response.body }}
          </span>
        </div>
      </div>
    </div>

    <!-- Held to a readable measure: across the full container the endpoint
         drifts so far from its title that the pairing stops reading. -->
    <ol
      class="relative mt-12 max-w-3xl before:absolute before:start-5 before:top-8 before:bottom-8 before:w-px before:bg-border sm:mt-16"
    >
      <li v-for="(chapter, index) of chapters" :key="chapter.slug">
        <NuxtLink
          :to="`/tutorial/${chapter.slug}`"
          class="group flex items-center gap-5 rounded-lg px-2 py-5 transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span
            class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-inverted"
          >
            {{ index + 1 }}
          </span>

          <span class="min-w-0">
            <span class="block font-medium text-highlighted">
              {{ chapter.title }}
            </span>
            <span class="block text-sm text-muted">{{ chapter.teaches }}</span>
          </span>

          <span
            class="ms-auto hidden shrink-0 font-mono text-xs text-dimmed sm:block"
          >
            {{ chapter.method }} {{ chapter.path }}
          </span>
        </NuxtLink>
      </li>
    </ol>
  </UContainer>
</template>
