<script setup lang="ts">
import type {
  RunnerResponse,
  RunnerStatus,
} from '~/composables/useLitestarRunner'

const {
  status,
  statusMessage = '',
  error,
  results = [],
  requestCount = 0,
} = defineProps<{
  /** Where the Python runtime is in its lifecycle. */
  status: RunnerStatus
  /** Progress line shown while it boots. */
  statusMessage?: string
  /** Boot failure when `status` is `failed`, otherwise the user's traceback. */
  error?: string
  results?: RunnerResponse[]
  /** How many requests Run will send — shown before the first run. */
  requestCount?: number
}>()

const emit = defineEmits<{
  /** The reader asked to boot Python again after a failure. */
  retry: []
}>()
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-y-auto bg-elevated/40">
    <div
      v-if="status === 'booting'"
      class="flex flex-col gap-2 px-3 py-4 text-sm text-muted"
    >
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-loader-circle" class="animate-spin" />
        {{ statusMessage || 'Starting Python…' }}
      </span>
      <UProgress size="sm" />
      <span class="text-xs text-dimmed">
        CPython and Litestar are downloaded once, then cached by your browser.
      </span>
    </div>

    <UAlert
      v-else-if="status === 'failed'"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Couldn't start Python"
      :actions="[
        {
          label: 'Try again',
          icon: 'i-lucide-rotate-cw',
          color: 'error',
          variant: 'outline',
          onClick: () => emit('retry'),
        },
      ]"
      class="m-3"
    >
      <template #description>
        A download was blocked or interrupted. Check your connection, or any ad
        blocker, then try again.
        <span v-if="error" class="mt-1 block font-mono text-xs opacity-75">
          {{ errorSummary(error) }}
        </span>
      </template>
    </UAlert>

    <template v-else>
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-x"
        title="Your code raised an error"
        class="m-3"
      >
        <template #description>
          <pre class="overflow-x-auto text-xs whitespace-pre-wrap">{{
            error
          }}</pre>
        </template>
      </UAlert>

      <p v-else-if="!results.length" class="px-3 py-4 text-sm text-muted">
        Press <span class="font-medium text-highlighted">Run</span> to send
        {{ requestCount }}
        {{ requestCount === 1 ? 'request' : 'requests' }}
        to your app.
      </p>

      <div v-for="result of results" :key="result.label" class="px-3 py-2">
        <div class="flex items-center gap-2">
          <UBadge
            :color="statusColor(result.status)"
            variant="subtle"
            size="sm"
          >
            {{ result.status }}
          </UBadge>
          <span class="font-mono text-xs text-muted">
            {{ result.label }}
          </span>
        </div>
        <pre class="mt-1.5 overflow-x-auto font-mono text-xs text-default">{{
          formatBody(result.body, result.contentType)
        }}</pre>
      </div>
    </template>
  </div>
</template>
