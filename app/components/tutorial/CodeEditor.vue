<script setup lang="ts">
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'

const { modelValue } = defineProps<{ modelValue: string }>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const host = ref<HTMLDivElement>()
const colorMode = useColorMode()

// Swapped at runtime when the site's theme toggle changes, without rebuilding
// the editor (which would lose the cursor and undo history).
const theme = new Compartment()

let view: EditorView | undefined

const themeExtension = () => (colorMode.value === 'dark' ? oneDark : [])

/** Match the surrounding Nuxt UI surface rather than CodeMirror's defaults. */
const baseTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    height: '100%',
    fontSize: '0.8125rem',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
    lineHeight: '1.6',
  },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none' },
  '.cm-content': { padding: '0.75rem 0' },
  '&.cm-focused': { outline: 'none' },
})

onMounted(() => {
  // CodeMirror happily builds a detached editor when `parent` is undefined,
  // which renders as a silently empty pane — fail loudly instead.
  if (!host.value) throw new Error('Tutorial editor host element is missing')

  view = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: modelValue,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        python(),
        baseTheme,
        theme.of(themeExtension()),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit('update:modelValue', update.state.doc.toString())
          }
        }),
      ],
    }),
  })
})

watch(
  () => colorMode.value,
  () => {
    view?.dispatch({ effects: theme.reconfigure(themeExtension()) })
  },
)

// Only react to changes that came from outside (reset, solution toggle):
// echoing the user's own keystrokes back would fight the cursor.
watch(
  () => modelValue,
  (value) => {
    if (!view || value === view.state.doc.toString()) return

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    })
  },
)

onBeforeUnmount(() => view?.destroy())
</script>

<template>
  <div ref="host" class="h-full overflow-auto" />
</template>
