/**
 * Boots the real Litestar in Pyodide (under Node) and runs every tutorial step
 * through the same Python runner the browser worker loads.
 *
 * This is the regression net for two things a unit test can't cover: the
 * thread-free shims still working on new Litestar/Pyodide releases, and each
 * chapter's code actually producing the responses its prose promises.
 *
 * Needs network access on first run to fetch wheels, so it lives in its own
 * vitest project (`pnpm test-pyodide`) and is kept out of `test-all`.
 */
import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadPyodide, type PyodideInterface } from 'pyodide'
import { beforeAll, describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '../..')
const runnerSource = readFileSync(
  join(root, 'app/workers/litestar-runner.py'),
  'utf8',
)

/** Read a chapter's code from disk, exactly as the glob hands it to the browser. */
const step = (dir: string, kind: 'files' | 'solution') => {
  const base = join(root, 'content/tutorial/01-basics', dir, kind)

  return Object.fromEntries(
    globSync('**/*.py', { cwd: base }).map((file) => [
      file,
      readFileSync(join(base, file), 'utf8'),
    ]),
  )
}

interface RunResult {
  error?: string
  results?: { label: string; status: number; body: string }[]
}

let pyodide: PyodideInterface

async function run(
  files: Record<string, string>,
  requests: { label?: string; method?: string; path: string; body?: unknown }[],
): Promise<RunResult> {
  const payload = JSON.stringify({ files, requests })
  pyodide.globals.set('_payload', payload)
  const raw = await pyodide.runPythonAsync(
    'await __import__("litestar_runner").run(_payload)',
  )
  return JSON.parse(raw)
}

beforeAll(async () => {
  pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} })
  await pyodide.loadPackage('micropip', { messageCallback: () => {} })
  const micropip = pyodide.pyimport('micropip')
  await micropip.install('litestar')

  pyodide.FS.writeFile('/home/pyodide/litestar_runner.py', runnerSource)
  await pyodide.runPythonAsync(
    'import sys; sys.path.insert(0, "/home/pyodide")\n' +
      'import litestar_runner; litestar_runner.install_shim()',
  )
}, 300_000)

describe('litestar runner in pyodide', () => {
  it('serves a request without a server', async () => {
    const result = await run(step('01-hello', 'solution'), [{ path: '/' }])

    expect(result.error).toBeUndefined()
    expect(result.results).toEqual([
      {
        label: 'GET /',
        status: 200,
        contentType: 'application/json',
        body: '{"hello":"litestar"}',
      },
    ])
  })

  it('reports a traceback for broken user code instead of throwing', async () => {
    const result = await run({ 'main.py': 'def oops(:' }, [{ path: '/' }])

    expect(result.error).toContain('SyntaxError')
  })

  it('points at the failing line in the step, not at the runner', async () => {
    const result = await run(
      {
        'main.py': 'from helper import boom\n\nvalue = boom()\n',
        'helper.py': 'def boom():\n    return undefined_name\n',
      },
      [],
    )

    expect(result.error).toContain('main.py", line 3')
    expect(result.error).toContain('helper.py", line 2')
    expect(result.error).toContain("NameError: name 'undefined_name'")
    expect(result.error).not.toContain('litestar_runner')
    expect(result.error).not.toContain('importlib')
  })

  it('runs startup hooks before the first request', async () => {
    const result = await run(
      {
        'main.py': [
          'from litestar import Litestar, get',
          '',
          'ready = False',
          '',
          'async def warm_up() -> None:',
          '    global ready',
          '    ready = True',
          '',
          '@get("/")',
          'async def index() -> dict[str, bool]:',
          '    return {"ready": ready}',
          '',
          'app = Litestar([index], on_startup=[warm_up])',
        ].join('\n'),
      },
      [{ path: '/' }],
    )

    expect(result.error).toBeUndefined()
    expect(result.results?.[0]?.body).toBe('{"ready":true}')
  })

  it('requires an app variable', async () => {
    const result = await run({ 'main.py': 'x = 1' }, [{ path: '/' }])

    expect(result.error).toContain('must define an `app` variable')
  })

  it('runs a step whose code is split across folders', async () => {
    const result = await run(
      {
        'main.py': [
          'from litestar import Litestar',
          'from controllers.greet import GreetController',
          '',
          'app = Litestar([GreetController])',
        ].join('\n'),
        'controllers/greet.py': [
          'from litestar import Controller, get',
          '',
          'class GreetController(Controller):',
          '    path = "/greet"',
          '',
          '    @get("/{name:str}")',
          '    async def greet(self, name: str) -> dict[str, str]:',
          '        return {"message": f"Hello, {name}!"}',
        ].join('\n'),
      },
      [{ path: '/greet/world' }],
    )

    expect(result.error).toBeUndefined()
    expect(result.results?.[0]?.body).toBe('{"message":"Hello, world!"}')
  })

  it('does not leak files from a previous run', async () => {
    await run({ 'main.py': 'x = 1', 'stale.py': 'LEFTOVER = True' }, [])
    const result = await run(
      {
        'main.py': [
          'import importlib.util',
          'from litestar import Litestar, get',
          '',
          '@get("/")',
          'async def index() -> dict[str, bool]:',
          '    return {"stale": importlib.util.find_spec("stale") is not None}',
          '',
          'app = Litestar([index])',
        ].join('\n'),
      },
      [{ path: '/' }],
    )

    expect(result.results?.[0]?.body).toBe('{"stale":false}')
  })

  it('picks up edits between runs', async () => {
    const first = await run(step('01-hello', 'files'), [{ path: '/' }])
    const second = await run(step('01-hello', 'solution'), [{ path: '/' }])

    expect(first.results?.[0]?.body).toBe('{}')
    expect(second.results?.[0]?.body).toBe('{"hello":"litestar"}')
  })
})

describe('chapter 02 — path and query parameters', () => {
  const requests = [
    { label: 'GET /items/42', path: '/items/42' },
    { label: 'GET /items/42?q=litestar', path: '/items/42?q=litestar' },
    { label: 'GET /items/abc', path: '/items/abc' },
  ]

  it('does not match a non-integer path parameter', async () => {
    const result = await run(step('02-path-params', 'files'), requests)
    const statuses = result.results?.map((r) => r.status)

    // `:int` is part of the route, so /items/abc is a 404, not a validation error.
    expect(statuses).toEqual([200, 200, 404])
  })

  it('returns the optional query parameter once solved', async () => {
    const result = await run(step('02-path-params', 'solution'), requests)

    expect(result.results?.[0]?.body).toBe('{"item_id":42,"q":null}')
    expect(result.results?.[1]?.body).toBe('{"item_id":42,"q":"litestar"}')
  })
})

describe('chapter 03 — request body validation', () => {
  const requests = [
    {
      label: 'valid',
      method: 'POST',
      path: '/todos',
      body: { title: 'Write the tutorial' },
    },
    {
      label: 'empty title',
      method: 'POST',
      path: '/todos',
      body: { title: '' },
    },
    {
      label: 'wrong type',
      method: 'POST',
      path: '/todos',
      body: { title: 123 },
    },
  ]

  it('accepts an empty title before the constraint is added', async () => {
    const result = await run(step('04-validation', 'files'), requests)

    expect(result.results?.map((r) => r.status)).toEqual([201, 201, 400])
  })

  it('rejects an empty title once min_length is declared', async () => {
    const result = await run(step('04-validation', 'solution'), requests)

    expect(result.results?.map((r) => r.status)).toEqual([201, 400, 400])
    expect(result.results?.[1]?.body).toContain('length >= 1')
  })
})

describe('chapter 04 — controllers across folders', () => {
  const requests = [
    { label: 'GET /greet/world', path: '/greet/world' },
    {
      label: 'GET /greet/litestar?excited=true',
      path: '/greet/litestar?excited=true',
    },
  ]

  it('ships both files to the runner', () => {
    expect(Object.keys(step('08-controllers', 'files')).sort()).toEqual([
      'controllers/greet.py',
      'main.py',
    ])
  })

  it('has no routes until the controller is registered', async () => {
    const result = await run(step('08-controllers', 'files'), requests)

    expect(result.error).toBeUndefined()
    expect(result.results?.map((r) => r.status)).toEqual([404, 404])
  })

  it('greets through the controller once solved', async () => {
    const result = await run(step('08-controllers', 'solution'), requests)

    expect(result.results?.map((r) => r.status)).toEqual([200, 200])
    expect(result.results?.[0]?.body).toBe('{"message":"Hello, world"}')
    expect(result.results?.[1]?.body).toBe('{"message":"Hello, litestar!"}')
  })
})

describe('chapter 03 — query parameters', () => {
  const requests = [
    { label: 'limit=2', path: '/items?limit=2' },
    { label: 'no limit', path: '/items' },
    { label: 'limit=3&q=spec', path: '/items?limit=3&q=spec' },
    { label: 'limit=0', path: '/items?limit=0' },
  ]

  it('rejects a request missing the required parameter', async () => {
    const result = await run(step('03-query-params', 'files'), requests)

    // `limit` has no default, so /items never reaches the handler.
    expect(result.results?.map((r) => r.status)).toEqual([200, 400, 200, 200])
  })

  it('filters on q and rejects limit=0 once solved', async () => {
    const result = await run(step('03-query-params', 'solution'), requests)

    expect(result.results?.map((r) => r.status)).toEqual([200, 400, 200, 400])
    expect(result.results?.[2]?.body).toBe(
      '{"items":["msgspec","sqlspec"],"q":"spec"}',
    )
  })
})
