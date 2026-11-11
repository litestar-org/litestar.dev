import type {
  RunnerIn,
  RunnerOut,
  RunnerRequest,
} from '~/workers/litestar-runner.worker'

export interface RunnerResponse {
  label: string
  status: number
  contentType: string
  body: string
}

/** What the Python runner reports back for one execution. */
interface RunnerPayload {
  results?: RunnerResponse[]
  error?: string
}

export type RunnerStatus = 'idle' | 'booting' | 'ready' | 'failed'

/**
 * Drives the Pyodide worker that executes tutorial code.
 *
 * Client-only: call it from a component that renders inside `<ClientOnly>`,
 * since the worker has no meaning during prerendering.
 */
export const useLitestarRunner = () => {
  const worker = shallowRef<Worker>()
  const status = ref<RunnerStatus>('idle')
  const statusMessage = ref('')
  const running = ref(false)
  const results = ref<RunnerResponse[]>([])
  const error = ref<string>()

  let nextId = 0
  const pending = new Map<number, (payload: RunnerPayload) => void>()

  const ensureWorker = () => {
    if (worker.value) return worker.value

    status.value = 'booting'
    statusMessage.value = 'Starting Python…'

    const instance = new Worker(
      new URL('~/workers/litestar-runner.worker.ts', import.meta.url),
      { type: 'module', name: 'litestar-runner' },
    )

    instance.addEventListener('message', (event: MessageEvent<RunnerOut>) => {
      const message = event.data

      switch (message.type) {
        case 'status':
          statusMessage.value = message.message
          break
        case 'ready':
          status.value = 'ready'
          statusMessage.value = ''
          break
        case 'result':
          pending.get(message.id)?.(
            JSON.parse(message.payload) as RunnerPayload,
          )
          pending.delete(message.id)
          break
        case 'failed':
          // A boot failure stops everything until `retryBoot`; a run failure
          // only ends that run.
          if (message.id === undefined) {
            status.value = 'failed'
          } else {
            pending.get(message.id)?.({ error: message.message })
            pending.delete(message.id)
          }
          statusMessage.value = ''
          error.value = message.message
          break
      }
    })

    worker.value = instance
    return instance
  }

  const send = (message: RunnerIn) => ensureWorker().postMessage(message)

  /** Start downloading Python ahead of the first Run click. */
  const boot = () => {
    if (status.value === 'idle') send({ type: 'init' })
  }

  /** Try booting again after a failure — the reader's "Try again" button. */
  const retryBoot = () => {
    if (status.value !== 'failed') return

    status.value = 'booting'
    statusMessage.value = 'Starting Python…'
    error.value = undefined
    send({ type: 'init' })
  }

  const run = async (
    files: Record<string, string>,
    requests: RunnerRequest[],
  ) => {
    running.value = true
    error.value = undefined

    const id = ++nextId
    const payload = await new Promise<RunnerPayload>((resolve) => {
      pending.set(id, resolve)
      try {
        // Serialize here: `files` and `requests` arrive as Vue reactive
        // proxies, and structured clone throws DataCloneError on a Proxy.
        send({ type: 'run', id, payload: JSON.stringify({ files, requests }) })
      } catch (cause) {
        // Never leave the button spinning on a message we failed to post.
        pending.delete(id)
        resolve({
          error: cause instanceof Error ? cause.message : String(cause),
        })
      }
    })

    results.value = payload.results ?? []
    error.value = payload.error
    running.value = false

    return payload
  }

  onScopeDispose(() => {
    worker.value?.terminate()
    pending.clear()
  })

  return {
    status: readonly(status),
    statusMessage: readonly(statusMessage),
    running: readonly(running),
    results,
    error,
    boot,
    retryBoot,
    run,
  }
}
