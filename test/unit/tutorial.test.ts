import { describe, it, expect } from 'vitest'
import {
  groupStepFiles,
  parseStepDir,
  stepSlugFromPath,
  stepSurroundings,
} from '../../app/utils/tutorial'

describe('parseStepDir', () => {
  it('splits the ordering prefix from the slug', () => {
    expect(parseStepDir('01-hello')).toEqual({ order: 1, slug: 'hello' })
    expect(parseStepDir('02-path-params')).toEqual({
      order: 2,
      slug: 'path-params',
    })
    expect(parseStepDir('10-validation')).toEqual({
      order: 10,
      slug: 'validation',
    })
  })

  it('rejects directories without a numeric prefix', () => {
    expect(parseStepDir('hello')).toBeNull()
    expect(parseStepDir('_draft')).toBeNull()
    expect(parseStepDir('01')).toBeNull()
  })
})

describe('stepSlugFromPath', () => {
  it('derives the slug from a content path', () => {
    expect(stepSlugFromPath('/tutorial/01-hello')).toBe('hello')
    expect(stepSlugFromPath('/tutorial/02-path-params')).toBe('path-params')
  })

  it('tolerates a trailing segment or slash', () => {
    expect(stepSlugFromPath('/tutorial/01-hello/')).toBe('hello')
  })

  it('returns null for paths outside the tutorial tree', () => {
    expect(stepSlugFromPath('/blog/some-post')).toBeNull()
    expect(stepSlugFromPath('/tutorial')).toBeNull()
  })
})

describe('groupStepFiles', () => {
  const modules = {
    '/content/tutorial/01-hello/files/main.py': 'starting hello',
    '/content/tutorial/01-hello/solution/main.py': 'solved hello',
    '/content/tutorial/02-path-params/files/main.py': 'starting params',
    '/content/tutorial/02-path-params/solution/main.py': 'solved params',
  }

  it('groups raw modules by step slug, split by kind', () => {
    expect(groupStepFiles(modules)).toEqual({
      hello: {
        files: { 'main.py': 'starting hello' },
        solution: { 'main.py': 'solved hello' },
      },
      'path-params': {
        files: { 'main.py': 'starting params' },
        solution: { 'main.py': 'solved params' },
      },
    })
  })

  it('keeps multiple files per step', () => {
    const grouped = groupStepFiles({
      '/content/tutorial/01-hello/files/main.py': 'app',
      '/content/tutorial/01-hello/files/models.py': 'models',
    })

    expect(Object.keys(grouped.hello!.files)).toEqual(['main.py', 'models.py'])
    expect(grouped.hello!.solution).toEqual({})
  })

  it('keeps the subpath of files in folders', () => {
    const grouped = groupStepFiles({
      '/content/tutorial/04-controllers/files/main.py': 'app',
      '/content/tutorial/04-controllers/files/controllers/greet.py': 'greet',
      '/content/tutorial/04-controllers/solution/controllers/greet.py': 'done',
    })

    expect(grouped.controllers).toEqual({
      files: { 'main.py': 'app', 'controllers/greet.py': 'greet' },
      solution: { 'controllers/greet.py': 'done' },
    })
  })

  it('ignores paths that are not step files', () => {
    expect(
      groupStepFiles({
        '/content/tutorial/01-hello/notes.py': 'stray',
        '/content/tutorial/hello/files/main.py': 'unprefixed',
        '/content/tutorial/01-hello/files/main.py': 'kept',
      }),
    ).toEqual({
      hello: { files: { 'main.py': 'kept' }, solution: {} },
    })
  })
})

describe('stepSurroundings', () => {
  const slugs = ['hello', 'path-params', 'validation']

  it('resolves neighbours in the middle of the tutorial', () => {
    expect(stepSurroundings(slugs, 'path-params')).toEqual({
      prev: 'hello',
      next: 'validation',
    })
  })

  it('leaves the first step without a previous one', () => {
    expect(stepSurroundings(slugs, 'hello')).toEqual({
      prev: undefined,
      next: 'path-params',
    })
  })

  it('leaves the last step without a next one', () => {
    expect(stepSurroundings(slugs, 'validation')).toEqual({
      prev: 'path-params',
      next: undefined,
    })
  })

  it('returns no neighbours for an unknown step', () => {
    expect(stepSurroundings(slugs, 'nope')).toEqual({
      prev: undefined,
      next: undefined,
    })
  })
})
