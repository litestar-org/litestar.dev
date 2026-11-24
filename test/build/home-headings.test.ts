import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DIST = new URL('../../.output/public/', import.meta.url).pathname

describe('prerendered home page', () => {
  // The plugins section title is a markdown string rendered by <LazyMDC>, so it
  // is parsed on the server at prerender time. If that parse throws (e.g. a
  // bundled CJS dependency calling a bare `require`), MDC renders nothing and
  // the <h2> ships empty with no build error.
  it('renders text in every section heading', async () => {
    const html = await readFile(join(DIST, 'index.html'), 'utf8')
    const headings = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(
      (m) =>
        m[1]!
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<[^>]+>/g, '')
          .trim(),
    )

    expect(headings.length).toBeGreaterThan(0)
    expect(headings.filter((text) => text === '')).toEqual([])
    expect(headings).toContain('Extend Litestar with plugins')
  })
})
