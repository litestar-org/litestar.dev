<script setup lang="ts">
import type { TutorialSession } from '~/composables/useTutorialSession'
import TutorialCodeEditor from './CodeEditor.vue'

const { step, session } = defineProps<{
  /** `<track>/<slug>`; keys the editor so it remounts between chapters. */
  step: string
  session: TutorialSession
}>()

// `ProseCodeTree` splits these labels on `/` to build the folder tree, so a
// chapter shipping `controllers/greet.py` nests without any work here. No
// `component` is supplied: its content half is hidden and the editor is
// rendered by this component instead.
const items = computed(() =>
  session.filenames.value.map((name) => ({ label: name })),
)

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
  <USplitter
    orientation="vertical"
    auto-save-id="litestar-tutorial-output"
    :items="[
      { slot: 'code', minSize: 20 },
      { slot: 'output', defaultSize: 30, minSize: 10 },
    ]"
    class="h-full w-full min-w-0"
    :ui="{
      handle:
        'border-b border-default transition-colors hover:border-primary data-[resize-handle-state=drag]:border-primary',
    }"
  >
    <template #code>
      <USplitter
        auto-save-id="litestar-tutorial-files"
        :items="[
          { slot: 'files', defaultSize: 30, minSize: 15 },
          { slot: 'editor', minSize: 30 },
        ]"
        class="min-h-0 w-full flex-1 overflow-hidden"
        :ui="{
          handle:
            'border-e border-default transition-colors hover:border-primary data-[resize-handle-state=drag]:border-primary',
        }"
      >
        <template #files>
          <!-- Same component the home page hero uses, so the file tree, folder
               icons and per-extension file icons match across the site. Its
               content half is hidden: the editor lives in the sibling panel so
               a splitter can sit between them. -->
          <ProseCodeTree
            v-model="session.activeFile.value"
            :items="items"
            expand-all
            :ui="{
              // `w-full min-w-0`: the splitter panel is a flex container, so
              // the tree would otherwise shrink to the width of its longest
              // filename. The `lg:` resets matter — the theme sets those at
              // that breakpoint, and an unprefixed utility doesn't override a
              // prefixed one.
              root: 'my-0 block h-full lg:h-full w-full min-w-0 rounded-none border-0',
              list: 'h-full border-b-0 border-e-0 lg:border-b-0 lg:border-e-0',
              content: 'hidden',
            }"
          />
        </template>

        <template #editor>
          <TutorialCodeEditor
            v-model="session.sources.value[session.activeFile.value]!"
            :key="`${step}-${session.activeFile.value}`"
          />
        </template>
      </USplitter>
    </template>

    <template #output>
      <div class="flex h-full w-full flex-col overflow-y-auto bg-elevated/40">
        <div
          v-if="session.status.value === 'booting'"
          class="flex flex-col gap-2 px-3 py-4 text-sm text-muted"
        >
          <span class="flex items-center gap-2">
            <UIcon name="i-lucide-loader-circle" class="animate-spin" />
            {{ session.statusMessage.value || 'Starting Python…' }}
          </span>
          <UProgress size="sm" />
          <span class="text-xs text-dimmed">
            CPython and Litestar are downloaded once, then cached by your
            browser.
          </span>
        </div>

        <UAlert
          v-else-if="session.status.value === 'failed'"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Couldn't start Python"
          :description="session.error.value"
          class="m-3"
        />

        <template v-else>
          <UAlert
            v-if="session.error.value"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-x"
            title="Your code raised an error"
            class="m-3"
          >
            <template #description>
              <pre class="overflow-x-auto text-xs whitespace-pre-wrap">{{
                session.error.value
              }}</pre>
            </template>
          </UAlert>

          <p
            v-else-if="!session.results.value.length"
            class="px-3 py-4 text-sm text-muted"
          >
            Press <UKbd value="Run" /> to send
            {{ session.requests.value.length }}
            {{ session.requests.value.length === 1 ? 'request' : 'requests' }}
            to your app.
          </p>

          <div
            v-for="result of session.results.value"
            :key="result.label"
            class="px-3 py-2"
          >
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
            <pre
              class="mt-1.5 overflow-x-auto font-mono text-xs text-default"
              >{{ formatBody(result.body, result.contentType) }}</pre>
          </div>
        </template>
      </div>
    </template>
  </USplitter>
</template>
