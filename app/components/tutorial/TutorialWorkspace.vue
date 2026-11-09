<script setup lang="ts">
import type { RunnerRequest } from '~/workers/litestar-runner.worker'
import TutorialCodeEditor from './CodeEditor.vue'

const { step, files, solution, requests } = defineProps<{
  /** Slug of the current step; editing state resets when it changes. */
  step: string
  files: Record<string, string>
  solution: Record<string, string>
  requests: RunnerRequest[]
}>()

const { status, statusMessage, running, results, error, boot, run } =
  useLitestarRunner()

/** Open `main.py` first — the tree sorts folders above it, but it's the entry point. */
const defaultFile = (step: Record<string, string>) =>
  'main.py' in step ? 'main.py' : (Object.keys(step)[0] ?? 'main.py')

const sources = ref<Record<string, string>>({ ...files })
const activeFile = ref(defaultFile(files))
const showingSolution = ref(false)

const filenames = computed(() => Object.keys(sources.value))
const hasSolution = computed(() => Object.keys(solution).length > 0)

// `ProseCodeTree` splits these labels on `/` to build the folder tree, so a
// step shipping `controllers/greet.py` nests without any work here. No
// `component` is supplied: its content half is hidden and the editor is
// rendered by this component instead.
const items = computed(() => filenames.value.map((name) => ({ label: name })))

// Download Python while the reader is still on the prose, so the first Run
// doesn't start with a 5 MB wait.
onMounted(boot)

watch(
  () => step,
  () => {
    sources.value = { ...files }
    activeFile.value = defaultFile(files)
    showingSolution.value = false
    results.value = []
    error.value = undefined
  },
)

const reset = () => {
  sources.value = { ...files }
  showingSolution.value = false
}

const toggleSolution = () => {
  showingSolution.value = !showingSolution.value
  sources.value = showingSolution.value ? { ...solution } : { ...files }
}

const execute = () => run(sources.value, requests)

const statusColor = (code: number) => {
  if (code < 300) return 'success' as const
  if (code < 400) return 'info' as const
  if (code < 500) return 'warning' as const
  return 'error' as const
}

/** Pretty-print JSON bodies, leave anything else untouched. */
const formatBody = (body: string, contentType: string) => {
  if (!contentType.includes('json')) return body

  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}
</script>

<template>
  <!-- `w-full min-w-0`: the splitter panel is a flex container, so without it
       this root shrinks to the width of the code rather than filling the pane. -->
  <div class="flex h-full w-full min-w-0 flex-col divide-y divide-default">
    <div class="flex items-center gap-1 px-2 py-1.5">
      <span class="ps-1.5 text-xs font-medium text-dimmed">
        {{ filenames.length }}
        {{ filenames.length === 1 ? 'file' : 'files' }}
      </span>

      <div class="ms-auto flex items-center gap-1">
        <UButton
          icon="i-lucide-rotate-ccw"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="reset"
        >
          Reset
        </UButton>
        <UButton
          v-if="hasSolution"
          :icon="showingSolution ? 'i-lucide-eye-off' : 'i-lucide-lightbulb'"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="toggleSolution"
        >
          {{ showingSolution ? 'Hide solution' : 'Solution' }}
        </UButton>
        <UButton
          icon="i-lucide-play"
          size="xs"
          :loading="running"
          :disabled="status === 'failed'"
          @click="execute"
        >
          Run
        </UButton>
      </div>
    </div>

    <USplitter
      auto-save-id="litestar-tutorial-files"
      :items="[
        { slot: 'files', defaultSize: 30, minSize: 15 },
        { slot: 'editor', minSize: 30 },
      ]"
      class="min-h-48 flex-1 overflow-hidden"
      :ui="{
        handle:
          'border-e border-default transition-colors hover:border-primary data-[resize-handle-state=drag]:border-primary',
      }"
    >
      <template #files>
        <!-- Same component the home page hero uses, so the file tree, folder
             icons and per-extension file icons match across the site. Its
             content half is hidden: the editor lives in the sibling panel so a
             splitter can sit between them. -->
        <ProseCodeTree
          v-model="activeFile"
          :items="items"
          expand-all
          :ui="{
            // `w-full min-w-0`: the splitter panel is a flex container, so the
            // tree would otherwise shrink to the width of its longest filename.
            // The `lg:` resets matter — the theme sets those at that breakpoint,
            // and an unprefixed utility doesn't override a prefixed one.
            root: 'my-0 block h-full lg:h-full w-full min-w-0 rounded-none border-0',
            list: 'h-full border-b-0 border-e-0 lg:border-b-0 lg:border-e-0',
            content: 'hidden',
          }"
        />
      </template>

      <template #editor>
        <TutorialCodeEditor
          v-model="sources[activeFile]!"
          :key="`${step}-${activeFile}`"
        />
      </template>
    </USplitter>

    <div
      class="flex max-h-[45%] min-h-32 flex-col overflow-y-auto bg-elevated/40"
    >
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
        :description="error"
        class="m-3"
      />

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
          Press <UKbd value="Run" /> to send
          {{ requests.length }}
          {{ requests.length === 1 ? 'request' : 'requests' }}
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
            <span class="font-mono text-xs text-muted">{{ result.label }}</span>
          </div>
          <pre class="mt-1.5 overflow-x-auto font-mono text-xs text-default">{{
            formatBody(result.body, result.contentType)
          }}</pre>
        </div>
      </template>
    </div>
  </div>
</template>
