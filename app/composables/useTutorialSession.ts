import type { RunnerRequest } from '~/workers/litestar-runner.worker'

/** Open `main.py` first — the tree sorts folders above it, but it's the entry point. */
const defaultFile = (files: Record<string, string>) =>
  'main.py' in files ? 'main.py' : (Object.keys(files)[0] ?? 'main.py')

/**
 * One chapter's editing session: the files being edited, the solution toggle
 * and the Python runner.
 *
 * It lives above the panes because the toolbar and the editor sit on opposite
 * sides of the page's splitter — the Run button and the code it runs are in
 * different components.
 */
export const useTutorialSession = (source: {
  /** `<track>/<slug>`; editing state resets when it changes. */
  step: () => string
  files: () => Record<string, string>
  solution: () => Record<string, string>
  requests: () => RunnerRequest[]
}) => {
  const {
    status,
    statusMessage,
    running,
    results,
    error,
    boot,
    retryBoot,
    run,
  } = useLitestarRunner()

  const sources = ref<Record<string, string>>({ ...source.files() })
  const activeFile = ref(defaultFile(source.files()))
  const showingSolution = ref(false)

  const filenames = computed(() => Object.keys(sources.value))
  const hasSolution = computed(() => Object.keys(source.solution()).length > 0)

  // Download Python while the reader is still on the prose, so the first Run
  // doesn't start with a 5 MB wait.
  onMounted(boot)

  watch(
    () => source.step(),
    () => {
      sources.value = { ...source.files() }
      activeFile.value = defaultFile(source.files())
      showingSolution.value = false
      results.value = []
      error.value = undefined
    },
  )

  const reset = () => {
    sources.value = { ...source.files() }
    showingSolution.value = false
  }

  const toggleSolution = () => {
    showingSolution.value = !showingSolution.value
    sources.value = showingSolution.value
      ? { ...source.solution() }
      : { ...source.files() }
  }

  const execute = () => run(sources.value, source.requests())

  return {
    sources,
    activeFile,
    showingSolution,
    filenames,
    hasSolution,
    requests: computed(() => source.requests()),
    status,
    statusMessage,
    running,
    results,
    error,
    reset,
    toggleSolution,
    execute,
    retryBoot,
  }
}

export type TutorialSession = ReturnType<typeof useTutorialSession>
