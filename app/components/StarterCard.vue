<script setup lang="ts">
import type { StartersCollectionItem } from '@nuxt/content'

// One entry of the litestar-templates manifest (the collection holds the
// whole manifest as a single item).
type Starter = StartersCollectionItem['templates'][number]

const { starter } = defineProps<{
  starter: Starter
}>()

const { copy } = useClipboard()

// The folder lives at `directory` in the litestar-templates repo.
const githubUrl = computed(
  () =>
    `https://github.com/litestar-org/litestar-templates/tree/main/${starter.directory}`,
)

// giget downloads just that folder from the repo tarball.
const dynamicCommand = computed(() => {
  if (!starter.directory) return ''
  return `npx giget@latest gh:litestar-org/litestar-templates/${starter.directory} ${starter.name}`
})

function copyCommand() {
  if (dynamicCommand.value) {
    copy(dynamicCommand.value, {
      title: 'Command copied to clipboard:',
      description: dynamicCommand.value,
    })
  }
}
</script>

<template>
  <UPageCard
    :title="starter.title"
    :description="starter.description"
    external
    :ui="{
      footer: starter.name
        ? 'w-full mt-auto pointer-events-auto pt-4 z-[1]'
        : '',
    }"
  >
    <template #leading>
      <UIcon
        v-if="starter.icon"
        :name="starter.icon"
        class="size-10 text-primary"
      />
    </template>
    <UBadge
      v-if="starter.featured === true"
      class="shine absolute top-4 right-4 sm:top-6 sm:right-6"
      variant="subtle"
      color="success"
      label="Recommended"
    />
    <template #title>
      {{ starter.title }}
    </template>

    <template #description>
      <span class="line-clamp-2">{{ starter.description }}</span>
    </template>

    <template v-if="starter.name" #footer>
      <USeparator type="dashed" class="mb-4" />

      <div class="flex items-center justify-between gap-2">
        <UTooltip text="View on GitHub">
          <UButton
            :to="githubUrl"
            target="_blank"
            icon="i-lucide-github"
            color="neutral"
            size="sm"
            variant="outline"
            external
            @click.stop
          >
            GitHub
            <span class="sr-only">View {{ starter.title }} on GitHub</span>
          </UButton>
        </UTooltip>

        <UTooltip text="Copy command">
          <UButton
            icon="i-lucide-terminal"
            color="neutral"
            size="sm"
            variant="outline"
            @click.stop="copyCommand()"
          >
            <span class="sr-only">Copy command for {{ starter.title }}</span>
          </UButton>
        </UTooltip>
      </div>
    </template>
  </UPageCard>
</template>
