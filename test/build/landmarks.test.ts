import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guards the html-validate `unique-landmark` rule: role="region" elements
// (e.g. UCarousel roots) are landmarks and must carry an accessible name —
// duplicates without one trip validation as soon as a page has two of them.
const DIST = new URL('../../.output/public/', import.meta.url).pathname

async function pagePaths(): Promise<string[]> {
  const xml = await readFile(join(DIST, 'sitemap.xml'), 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!)
  const base = new URL(locs[0]!).pathname.replace(/\/$/, '')
  return locs.map((loc) => {
    const p = new URL(loc).pathname
    const stripped = base ? p.replace(new RegExp(`^${base}`), '') : p
    return stripped || '/'
  })
}

function htmlPath(p: string): string {
  return p === '/' ? join(DIST, 'index.html') : join(DIST, p, 'index.html')
}

describe('landmark accessible names', () => {
  it('every role="region" landmark has an accessible name', async () => {
    const offenders: string[] = []

    for (const page of await pagePaths()) {
      const html = await readFile(htmlPath(page), 'utf8')
      for (const m of html.matchAll(/<[a-z]+\b[^>]*role="region"[^>]*>/g)) {
        const tag = m[0]
        if (!/aria-label(ledby)?="[^"]+"/.test(tag)) {
          offenders.push(`${page}: ${tag.slice(0, 120)}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })
})

describe('anchor attribute misuse', () => {
  // html-validate `attribute-misuse`: rel requires href. Nuxt UI renders
  // disabled link buttons as <a rel=...> with href stripped (LinkBase.vue),
  // so any disabled UButton/link with a `to` trips this in dev validation.
  it('no <a> carries rel without href', async () => {
    const offenders: string[] = []

    for (const page of await pagePaths()) {
      const html = await readFile(htmlPath(page), 'utf8')
      for (const m of html.matchAll(/<a\b[^>]*>/g)) {
        const tag = m[0]
        if (tag.includes('rel=') && !tag.includes('href')) {
          offenders.push(`${page}: ${tag.slice(0, 120)}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })
})
