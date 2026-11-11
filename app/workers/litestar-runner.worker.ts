/**
 * Runs tutorial code in a worker so Pyodide never blocks the UI thread.
 *
 * Pyodide is pulled from jsDelivr rather than bundled: it's ~5 MB brotli and
 * would otherwise land in the GitHub Pages deploy on every build. The CDN
 * version must match the `pyodide` devDependency, since `indexURL` also decides
 * where the prebuilt msgspec/multidict wheels come from.
 */
import type { PyodideInterface } from 'pyodide'
import runnerSource from './litestar-runner.py?raw'
import { withRetry } from '../utils/retry'

const PYODIDE_VERSION = '314.0.7'
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
const RUNNER_PATH = '/home/pyodide/litestar_runner.py'

export interface RunnerRequest {
  label?: string
  method?: string
  path: string
  body?: unknown
}

export type RunnerIn =
  | { type: 'init' }
  /** `payload` is pre-serialized `{files, requests}`: the caller's objects are
   *  Vue proxies, which structured clone refuses. */
  | { type: 'run'; id: number; payload: string }

export type RunnerOut =
  | { type: 'status'; message: string }
  | { type: 'ready' }
  | { type: 'result'; id: number; payload: string }
  | { type: 'failed'; id?: number; message: string }

const post = (message: RunnerOut) => self.postMessage(message)

let pyodide: PyodideInterface | undefined
let booting: Promise<PyodideInterface> | undefined

/**
 * Booting pulls ~30 files from jsDelivr and PyPI, and one dropped request
 * fails the lot — so each download step gets a few tries before giving up.
 * Files that did arrive are in the browser's cache, so a retry is cheap.
 */
const download = <T>(task: () => Promise<T>) =>
  withRetry(task, {
    onRetry: (attempt, attempts) =>
      post({
        type: 'status',
        message: `Download failed, retrying (${attempt} of ${attempts})…`,
      }),
  })

async function boot(): Promise<PyodideInterface> {
  post({ type: 'status', message: 'Downloading Python…' })

  const instance = await download(async () => {
    // The CDN URL must stay a runtime import — Vite would try to resolve it.
    const { loadPyodide } = (await import(
      /* @vite-ignore */ `${PYODIDE_INDEX}pyodide.mjs`
    )) as typeof import('pyodide')

    return loadPyodide({ indexURL: PYODIDE_INDEX })
  })

  post({ type: 'status', message: 'Installing Litestar…' })
  await download(async () => {
    await instance.loadPackage('micropip', { messageCallback: () => {} })
    await instance.pyimport('micropip').install('litestar')
  })

  instance.FS.writeFile(RUNNER_PATH, runnerSource)
  await instance.runPythonAsync(
    'import sys\n' +
      'if "/home/pyodide" not in sys.path:\n' +
      '    sys.path.insert(0, "/home/pyodide")\n' +
      'import litestar_runner\n' +
      'litestar_runner.install_shim()',
  )

  pyodide = instance
  post({ type: 'ready' })
  return instance
}

/** Boot at most once, and let every caller await the same attempt. */
function ensureBooted(): Promise<PyodideInterface> {
  booting ??= boot().catch((error) => {
    booting = undefined // let a later run retry after a failed download
    throw error
  })
  return booting
}

self.addEventListener('message', async (event: MessageEvent<RunnerIn>) => {
  const message = event.data

  if (message.type === 'init') {
    try {
      await ensureBooted()
    } catch (error) {
      post({ type: 'failed', message: describe(error) })
    }
    return
  }

  try {
    const instance = pyodide ?? (await ensureBooted())
    instance.globals.set('_payload', message.payload)
    const payload = await instance.runPythonAsync(
      'await __import__("litestar_runner").run(_payload)',
    )
    post({ type: 'result', id: message.id, payload })
  } catch (error) {
    post({ type: 'failed', id: message.id, message: describe(error) })
  }
})

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
