/**
 * Pure helpers for the interactive tutorial.
 *
 * Content is two levels deep — `content/tutorial/<NN-track>/<NN-chapter>` — and
 * both levels are named `NN-slug`: the numeric prefix orders them on disk, the
 * rest is the public slug (`/tutorial/basics/hello`). Directory names are the
 * single source of truth for order and URL, so neither can drift the way a
 * frontmatter field would.
 */

/** The two code variants shipped with every chapter. */
export type StepFileKind = 'files' | 'solution'

export interface TutorialStepFiles {
  /** Code the chapter starts from, keyed by path relative to the chapter root. */
  files: Record<string, string>
  /** Finished code revealed by the solution toggle, keyed the same way. */
  solution: Record<string, string>
}

/** Where a chapter sits: its track's slug, and its own slug within that track. */
export interface ChapterLocation {
  trackSlug: string
  slug: string
}

const STEP_DIR_RE = /^(\d+)-(.+)$/
// The trailing group keeps the whole subpath, so a chapter can ship folders
// (`controllers/greet.py`) and the file tree can nest them.
const STEP_FILE_RE = /\/tutorial\/([^/]+)\/([^/]+)\/(files|solution)\/(.+)$/

/** Split a `NN-slug` directory into its order and slug. */
export function parseStepDir(
  dir: string,
): { order: number; slug: string } | null {
  const match = STEP_DIR_RE.exec(dir)
  if (!match) return null

  return { order: Number(match[1]), slug: match[2]! }
}

/** Derive a chapter's track and slug from its `/tutorial/NN-track/NN-chapter` path. */
export function chapterFromPath(path: string): ChapterLocation | null {
  const segments = path.replace(/\/$/, '').split('/')
  const chapterDir = segments.pop()
  const trackDir = segments.pop()
  if (!chapterDir || !trackDir || segments.pop() !== 'tutorial') return null

  const track = parseStepDir(trackDir)
  const chapter = parseStepDir(chapterDir)
  if (!track || !chapter) return null

  return { trackSlug: track.slug, slug: chapter.slug }
}

/**
 * Derive a track's slug from its `tutorial/NN-track/track` content stem.
 *
 * Tracks are declared by a `track.yml` of their own rather than inferred from
 * their chapters, so a track can exist before anything has been written for it.
 */
export function trackSlugFromStem(stem: string): string | null {
  const [root, trackDir] = stem.replace(/^\//, '').split('/')
  if (root !== 'tutorial' || !trackDir) return null

  return parseStepDir(trackDir)?.slug ?? null
}

/**
 * Group raw `import.meta.glob` results into per-chapter code, keyed
 * `<track>/<slug>`.
 *
 * Anything that isn't a chapter file under two `NN-slug` directories is
 * ignored, so stray files in the tree can't break a page.
 */
export function groupStepFiles(
  modules: Record<string, string>,
): Record<string, TutorialStepFiles> {
  const steps: Record<string, TutorialStepFiles> = {}

  for (const [path, source] of Object.entries(modules)) {
    const match = STEP_FILE_RE.exec(path)
    if (!match) continue

    const track = parseStepDir(match[1]!)
    const chapter = parseStepDir(match[2]!)
    if (!track || !chapter) continue

    const key = `${track.slug}/${chapter.slug}`
    const step = (steps[key] ??= { files: {}, solution: {} })
    step[match[3] as StepFileKind][match[4]!] = source
  }

  return steps
}

/** Resolve the neighbouring chapter slugs for prev/next navigation. */
export function stepSurroundings(
  slugs: string[],
  current: string,
): { prev: string | undefined; next: string | undefined } {
  const index = slugs.indexOf(current)
  if (index === -1) return { prev: undefined, next: undefined }

  return { prev: slugs[index - 1], next: slugs[index + 1] }
}
