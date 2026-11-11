<script setup lang="ts">
import type { TutorialSession } from '~/composables/useTutorialSession'
import TutorialCodeEditor from './CodeEditor.vue'

const { chapterKey, session } = defineProps<{
  /** `<track>/<slug>`; keys the editor so it remounts between chapters. */
  chapterKey: string
  session: TutorialSession
}>()

// `ProseCodeTree` splits these labels on `/` to build the folder tree, so a
// chapter shipping `controllers/greet.py` nests without any work here. No
// `component` is supplied: its content half is hidden and the editor is
// rendered by this component instead.
const items = computed(() =>
  session.filenames.value.map((name) => ({ label: name })),
)
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
  >
    <template #code>
      <USplitter
        auto-save-id="litestar-tutorial-files"
        :items="[
          { slot: 'files', defaultSize: 30, minSize: 15 },
          { slot: 'editor', minSize: 30 },
        ]"
        class="min-h-0 w-full flex-1 overflow-hidden"
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
            :key="`${chapterKey}-${session.activeFile.value}`"
          />
        </template>
      </USplitter>
    </template>

    <template #output>
      <TutorialOutput
        :status="session.status.value"
        :status-message="session.statusMessage.value"
        :error="session.error.value"
        :results="session.results.value"
        :request-count="session.requests.value.length"
        @retry="session.retryBoot()"
      />
    </template>
  </USplitter>
</template>
