import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DIST = new URL('../../.output/public/', import.meta.url).pathname

// The blog listing reuses the per-article OG images as card images. Their
// paths are computed at prerender time and must reach the client on BOTH
// entry modes:
//  - hard load: inlined in the page's __NUXT_DATA__ payload
//  - client-side navigation: served via the extracted /blog/_payload.json
// A `useState`-only carrier covers the first but not the second (payload
// extraction only includes asyncData), which left the cards imageless after
// in-app navigation until a refresh.
async function cardSrcs(): Promise<string[]> {
  const html = await readFile(join(DIST, 'blog', 'index.html'), 'utf8')
  return [...html.matchAll(/src="([^"]*_og\/s\/[^"]+)"/g)].map((m) => m[1]!)
}

describe('blog listing OG card images', () => {
  it('extracted payload carries the per-article OG paths', async () => {
    // Compare against the paths the prerendered HTML actually uses rather than
    // an expected filename: nuxt-og-image derives the filename from the custom
    // `key`, and the scheme is internal (v6 emitted `k_<key>.png`, v7 emits
    // `o_<hash>.png`). devalue escapes the slashes, so unescape before matching.
    const payload = (
      await readFile(join(DIST, 'blog', '_payload.json'), 'utf8')
    ).replaceAll('\\u002F', '/')
    const srcs = await cardSrcs()
    expect(srcs.length).toBeGreaterThan(0)
    for (const src of srcs) {
      expect(
        payload,
        `OG path ${src} missing from extracted payload`,
      ).toContain(src)
    }
  })

  it('prerendered HTML references OG files that exist in the dist', async () => {
    const srcs = await cardSrcs()
    expect(srcs.length).toBeGreaterThan(0)
    for (const src of srcs) {
      const file = decodeURIComponent(src.replace(/^.*_og\/s\//, ''))
      await expect(
        readFile(join(DIST, '_og', 's', file)),
        `missing OG file for ${src}`,
      ).resolves.toBeDefined()
    }
  })
})
