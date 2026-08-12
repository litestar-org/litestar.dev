import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '../..')
const yml = readFileSync(
  join(root, 'content/templates/1.litestar-fullstack.yml'),
  'utf8',
)

describe('litestar-fullstack template content', () => {
  it('uses local theme screenshots backed by files in public/', () => {
    expect(yml).not.toContain('assets.hub.nuxt.com')

    const thumbnails = [
      ...yml.matchAll(/(dark|light):\s*'(\/templates\/[^']+)'/g),
    ]
    expect(thumbnails).toHaveLength(2)

    for (const [, , path] of thumbnails) {
      expect(existsSync(join(root, 'public', path!))).toBe(true)
    }
  })

  it('points the Preview link at the live demo, not the repository', () => {
    const previewBlock = yml.split('- label: Preview')[1]?.split('- label:')[0]
    expect(previewBlock).toBeDefined()
    expect(previewBlock).toContain("to: 'https://fullstack.litestar.dev/'")
  })
})
