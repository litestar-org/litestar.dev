<script setup lang="ts">
import type { TutorialPageCollectionItem } from '@nuxt/content'

const { hero, start } = defineProps<{
  /** Copy from `content/tutorial.yml`. */
  hero: TutorialPageCollectionItem['hero']
  /** URL of the first chapter — where the call to action goes. */
  start?: string
}>()
</script>

<template>
  <UPageHero
    orientation="horizontal"
    :title="hero.title"
    :description="hero.description"
    :ui="{ container: 'pb-16 sm:pb-16 lg:pb-16' }"
  >
    <template #footer>
      <UButton
        v-if="start"
        :to="start"
        size="xl"
        trailing-icon="i-lucide-arrow-right"
      >
        {{ hero.cta }}
      </UButton>

      <p class="mt-5 max-w-md text-sm text-dimmed">{{ hero.note }}</p>
    </template>

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
        <UBadge
          :color="statusColor(hero.response.status)"
          variant="subtle"
          size="sm"
        >
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
  </UPageHero>
</template>
