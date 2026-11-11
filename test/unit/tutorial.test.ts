import { describe, it, expect } from 'vitest'
import {
  chapterFromPath,
  chapterEditUrl,
  chapterIssueUrl,
  chapterPath,
  errorSummary,
  formatBody,
  groupBySection,
  groupStepFiles,
  parseStepDir,
  statusColor,
  stepSurroundings,
  trackSlugFromStem,
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

describe('chapterFromPath', () => {
  it('derives the track and chapter slugs', () => {
    expect(chapterFromPath('/tutorial/01-basics/01-hello')).toEqual({
      trackSlug: 'basics',
      slug: 'hello',
    })
    expect(chapterFromPath('/tutorial/02-database/03-repositories')).toEqual({
      trackSlug: 'database',
      slug: 'repositories',
    })
  })

  it('tolerates a trailing slash', () => {
    expect(chapterFromPath('/tutorial/01-basics/01-hello/')).toEqual({
      trackSlug: 'basics',
      slug: 'hello',
    })
  })

  it('returns null for anything that is not a chapter', () => {
    expect(chapterFromPath('/blog/some-post')).toBeNull()
    expect(chapterFromPath('/tutorial')).toBeNull()
    expect(chapterFromPath('/tutorial/01-basics')).toBeNull()
    // Both levels need their ordering prefix.
    expect(chapterFromPath('/tutorial/basics/01-hello')).toBeNull()
    expect(chapterFromPath('/tutorial/01-basics/hello')).toBeNull()
  })
})

describe('trackSlugFromStem', () => {
  it('derives the slug from a track file stem', () => {
    expect(trackSlugFromStem('tutorial/01-basics/track')).toBe('basics')
    expect(trackSlugFromStem('tutorial/02-advanced/track')).toBe('advanced')
  })

  it('tolerates a leading slash', () => {
    expect(trackSlugFromStem('/tutorial/01-basics/track')).toBe('basics')
  })

  it('returns null outside the tutorial tree or without an order prefix', () => {
    expect(trackSlugFromStem('blog/some-post')).toBeNull()
    expect(trackSlugFromStem('tutorial/basics/track')).toBeNull()
    expect(trackSlugFromStem('tutorial')).toBeNull()
  })
})

describe('groupStepFiles', () => {
  const modules = {
    '/content/tutorial/01-basics/01-hello/files/main.py': 'starting hello',
    '/content/tutorial/01-basics/01-hello/solution/main.py': 'solved hello',
    '/content/tutorial/01-basics/02-path-params/files/main.py':
      'starting params',
    '/content/tutorial/01-basics/02-path-params/solution/main.py':
      'solved params',
  }

  it('keys steps by track and slug, split by kind', () => {
    expect(groupStepFiles(modules)).toEqual({
      'basics/hello': {
        files: { 'main.py': 'starting hello' },
        solution: { 'main.py': 'solved hello' },
      },
      'basics/path-params': {
        files: { 'main.py': 'starting params' },
        solution: { 'main.py': 'solved params' },
      },
    })
  })

  it('keeps chapters from different tracks apart', () => {
    const grouped = groupStepFiles({
      '/content/tutorial/01-basics/01-hello/files/main.py': 'basics',
      '/content/tutorial/02-database/01-hello/files/main.py': 'database',
    })

    expect(Object.keys(grouped).sort()).toEqual([
      'basics/hello',
      'database/hello',
    ])
    expect(grouped['database/hello']!.files['main.py']).toBe('database')
  })

  it('keeps the subpath of files in folders', () => {
    const grouped = groupStepFiles({
      '/content/tutorial/01-basics/04-controllers/files/main.py': 'app',
      '/content/tutorial/01-basics/04-controllers/files/controllers/greet.py':
        'greet',
      '/content/tutorial/01-basics/04-controllers/solution/controllers/greet.py':
        'done',
    })

    expect(grouped['basics/controllers']).toEqual({
      files: { 'main.py': 'app', 'controllers/greet.py': 'greet' },
      solution: { 'controllers/greet.py': 'done' },
    })
  })

  it('ignores paths that are not step files', () => {
    expect(
      groupStepFiles({
        '/content/tutorial/01-basics/01-hello/notes.py': 'stray',
        '/content/tutorial/basics/01-hello/files/main.py': 'unprefixed track',
        '/content/tutorial/01-basics/hello/files/main.py': 'unprefixed chapter',
        '/content/tutorial/01-basics/01-hello/files/main.py': 'kept',
      }),
    ).toEqual({
      'basics/hello': { files: { 'main.py': 'kept' }, solution: {} },
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

describe('chapterPath', () => {
  it('builds the public URL from the two slugs', () => {
    expect(chapterPath('basics', 'hello')).toBe('/tutorial/basics/hello')
  })
})

describe('groupBySection', () => {
  const chapter = (slug: string, section: string) => ({ slug, section })

  it('groups consecutive chapters that share a section', () => {
    const hello = chapter('hello', 'First steps')
    const params = chapter('path-params', 'First steps')
    const errors = chapter('errors', 'Responses')

    expect(groupBySection([hello, params, errors])).toEqual([
      { title: 'First steps', chapters: [hello, params] },
      { title: 'Responses', chapters: [errors] },
    ])
  })

  it('keeps a section that comes back as a separate group', () => {
    const groups = groupBySection([
      chapter('a', 'First steps'),
      chapter('b', 'Responses'),
      chapter('c', 'First steps'),
    ])

    expect(groups.map((group) => group.title)).toEqual([
      'First steps',
      'Responses',
      'First steps',
    ])
  })

  it('returns nothing for an empty track', () => {
    expect(groupBySection([])).toEqual([])
  })
})

describe('statusColor', () => {
  it('maps each status class to a badge colour', () => {
    expect(statusColor(200)).toBe('success')
    expect(statusColor(201)).toBe('success')
    expect(statusColor(307)).toBe('info')
    expect(statusColor(404)).toBe('warning')
    expect(statusColor(500)).toBe('error')
  })
})

describe('formatBody', () => {
  it('pretty-prints JSON bodies', () => {
    expect(formatBody('{"hello":"litestar"}', 'application/json')).toBe(
      '{\n  "hello": "litestar"\n}',
    )
  })

  it('leaves other content types untouched', () => {
    expect(formatBody('{"a":1}', 'text/plain')).toBe('{"a":1}')
  })

  it('leaves a body that claims to be JSON but is not', () => {
    expect(formatBody('not json', 'application/json')).toBe('not json')
  })
})

describe('errorSummary', () => {
  it('keeps the last line of a traceback', () => {
    expect(
      errorSummary(
        'Traceback (most recent call last):\n  File "main.py", line 3\nNameError: nope\n',
      ),
    ).toBe('NameError: nope')
  })

  it('returns a one-line message as is', () => {
    expect(errorSummary('network down')).toBe('network down')
  })
})

describe('chapterEditUrl', () => {
  it('points at the chapter markdown on the main branch', () => {
    expect(chapterEditUrl('tutorial/01-basics/01-hello/index')).toBe(
      'https://github.com/litestar-org/litestar.dev/edit/main/content/tutorial/01-basics/01-hello/index.md',
    )
  })
})

describe('chapterIssueUrl', () => {
  it('prefills the issue with the chapter title and link', () => {
    const url = new URL(
      chapterIssueUrl({
        title: 'Your first route',
        to: '/tutorial/basics/hello',
      }),
    )

    expect(url.origin + url.pathname).toBe(
      'https://github.com/litestar-org/litestar.dev/issues/new',
    )
    expect(url.searchParams.get('title')).toBe('Tutorial: Your first route')
    expect(url.searchParams.get('body')).toContain(
      'https://litestar.dev/tutorial/basics/hello',
    )
  })
})
