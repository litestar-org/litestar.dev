import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { TutorialChapter, TutorialTrack } from '~/types'
import TutorialBar from '~/components/tutorial/Bar.vue'
import TutorialChapterList from '~/components/tutorial/ChapterList.vue'
import TutorialOutput from '~/components/tutorial/Output.vue'
import { UApp } from '#components'

const chapter = (slug: string, title: string, section: string) =>
  ({
    slug,
    title,
    section,
    trackSlug: 'basics',
    description: `About ${title}`,
    to: `/tutorial/basics/${slug}`,
  }) as TutorialChapter

const chapters = [
  chapter('hello', 'Your first route', 'First steps'),
  chapter('path-params', 'Path parameters', 'First steps'),
  chapter('errors', 'Error handling', 'Responses'),
]

const track: TutorialTrack = {
  slug: 'basics',
  title: 'Basic Litestar',
  description: 'Routing and parameters.',
  chapters,
}

describe('TutorialChapterList', () => {
  it('lists every chapter under its section, linking to it', async () => {
    const list = await mountSuspended(TutorialChapterList, {
      props: { chapters },
    })

    expect(list.findAll('h2').map((heading) => heading.text())).toEqual([
      'First steps',
      'Responses',
    ])
    expect(list.findAll('a').map((link) => link.attributes('href'))).toEqual([
      '/tutorial/basics/hello',
      '/tutorial/basics/path-params',
      '/tutorial/basics/errors',
    ])
    expect(list.text()).toContain('About Your first route')
  })

  it('marks only the current chapter', async () => {
    const list = await mountSuspended(TutorialChapterList, {
      props: { chapters, current: 'path-params' },
    })

    const current = list.findAll('a[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0]!.text()).toContain('Path parameters')
  })
})

describe('TutorialOutput', () => {
  it('shows progress while Python boots', async () => {
    const output = await mountSuspended(TutorialOutput, {
      props: { status: 'booting', statusMessage: 'Installing Litestar…' },
    })

    expect(output.text()).toContain('Installing Litestar…')
  })

  it('reports a failed boot with only the last line of the traceback', async () => {
    const output = await mountSuspended(TutorialOutput, {
      props: {
        status: 'failed',
        error:
          'Traceback (most recent call last):\n  File "x.py"\nAbortError: NetworkError',
      },
    })

    expect(output.text()).toContain("Couldn't start Python")
    expect(output.text()).toContain('AbortError: NetworkError')
    expect(output.text()).not.toContain('Traceback')
  })

  it('asks to boot again when the reader clicks Try again', async () => {
    const output = await mountSuspended(TutorialOutput, {
      props: { status: 'failed', error: 'network down' },
    })

    await output.find('button').trigger('click')

    expect(output.emitted('retry')).toHaveLength(1)
  })

  it('says how many requests Run will send before the first run', async () => {
    const one = await mountSuspended(TutorialOutput, {
      props: { status: 'ready', requestCount: 1 },
    })
    const two = await mountSuspended(TutorialOutput, {
      props: { status: 'ready', requestCount: 2 },
    })

    expect(one.text()).toContain('1 request to your app')
    expect(two.text()).toContain('2 requests to your app')
  })

  it('shows the traceback when the code raises', async () => {
    const output = await mountSuspended(TutorialOutput, {
      props: { status: 'ready', error: 'NameError: nope' },
    })

    expect(output.text()).toContain('Your code raised an error')
    expect(output.text()).toContain('NameError: nope')
  })

  it('renders each response with its status and formatted body', async () => {
    const output = await mountSuspended(TutorialOutput, {
      props: {
        status: 'ready',
        results: [
          {
            label: 'GET /',
            status: 200,
            contentType: 'application/json',
            body: '{"hello":"litestar"}',
          },
        ],
      },
    })

    expect(output.text()).toContain('200')
    expect(output.text()).toContain('GET /')
    expect(output.find('pre').text()).toBe('{\n  "hello": "litestar"\n}')
  })
})

describe('TutorialBar', () => {
  // The bar's tooltips need the provider `UApp` sets up at the app root.
  const mountBar = async (props: Record<string, unknown> = {}) => {
    const app = await mountSuspended(
      defineComponent(
        () => () =>
          h(UApp, () =>
            h(TutorialBar, { chapter: chapters[1]!, track, ...props }),
          ),
      ),
    )

    return app.findComponent(TutorialBar)
  }

  const button = (bar: Awaited<ReturnType<typeof mountBar>>, label: string) => {
    const found = bar
      .findAll('button')
      .find((candidate) => candidate.text() === label)
    if (!found) throw new Error(`No "${label}" button`)
    return found
  }

  it('shows where the reader is', async () => {
    const bar = await mountBar()

    expect(bar.text()).toContain('First steps')
    expect(bar.text()).toContain('Path parameters')
  })

  it('links to the neighbouring chapters', async () => {
    const bar = await mountBar({
      prev: '/tutorial/basics/hello',
      next: '/tutorial/basics/errors',
    })

    expect(
      bar.find('a[aria-label="Previous chapter"]').attributes('href'),
    ).toBe('/tutorial/basics/hello')
    expect(bar.find('a[aria-label="Next chapter"]').attributes('href')).toBe(
      '/tutorial/basics/errors',
    )
  })

  it('disables the arrows at the ends of a track', async () => {
    const bar = await mountBar()

    expect(
      bar.find('[aria-label="Previous chapter"]').attributes('disabled'),
    ).toBeDefined()
    expect(
      bar.find('[aria-label="Next chapter"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('emits run and reset', async () => {
    const bar = await mountBar()

    await button(bar, 'Run').trigger('click')
    await button(bar, 'Reset').trigger('click')

    expect(bar.emitted('run')).toHaveLength(1)
    expect(bar.emitted('reset')).toHaveLength(1)
  })

  it('offers the solution only when the chapter has one', async () => {
    const without = await mountBar()
    expect(without.text()).not.toContain('Solution')

    const withSolution = await mountBar({ hasSolution: true })
    await button(withSolution, 'Solution').trigger('click')
    expect(withSolution.emitted('toggleSolution')).toHaveLength(1)

    const showing = await mountBar({ hasSolution: true, showingSolution: true })
    expect(showing.text()).toContain('Hide solution')
  })

  it('cannot run when Python failed to start', async () => {
    const bar = await mountBar({ runDisabled: true })

    expect(button(bar, 'Run').attributes('disabled')).toBeDefined()
  })
})
