/**
 * Pure helpers for the interactive tutorial.
 *
 * Step directories are named `NN-slug` (`content/tutorial/01-hello`): the
 * numeric prefix orders them on disk, the rest is the public slug. The
 * directory name is the single source of truth for both, so a step's order and
 * its URL can never drift from each other the way a frontmatter field would.
 */

/** The two code variants shipped with every step. */
export type StepFileKind = 'files' | 'solution'

export interface TutorialStepFiles {
  /** Code the step starts from, keyed by path relative to the step root. */
  files: Record<string, string>
  /** Finished code revealed by the solution toggle, keyed the same way. */
  solution: Record<string, string>
}

const STEP_DIR_RE = /^(\d+)-(.+)$/
// The trailing group keeps the whole subpath, so a step can ship folders
// (`controllers/greet.py`) and the file tree can nest them.
const STEP_FILE_RE = /\/tutorial\/([^/]+)\/(files|solution)\/(.+)$/

/** Split a `NN-slug` step directory into its order and slug. */
export function parseStepDir(
  dir: string,
): { order: number; slug: string } | null {
  const match = STEP_DIR_RE.exec(dir)
  if (!match) return null

  return { order: Number(match[1]), slug: match[2]! }
}

/** Derive a step slug from a `/tutorial/NN-slug` content path. */
export function stepSlugFromPath(path: string): string | null {
  const dir = path.replace(/\/$/, '').split('/').pop()
  if (!dir || dir === 'tutorial') return null

  return parseStepDir(dir)?.slug ?? null
}

/**
 * Group raw `import.meta.glob` results into per-step code.
 *
 * Keys are absolute module paths; anything that isn't a step file under a
 * `NN-slug` directory is ignored, so stray files in the tree can't break a page.
 */
export function groupStepFiles(
  modules: Record<string, string>,
): Record<string, TutorialStepFiles> {
  const steps: Record<string, TutorialStepFiles> = {}

  for (const [path, source] of Object.entries(modules)) {
    const match = STEP_FILE_RE.exec(path)
    if (!match) continue

    const parsed = parseStepDir(match[1]!)
    if (!parsed) continue

    const step = (steps[parsed.slug] ??= { files: {}, solution: {} })
    step[match[2] as StepFileKind][match[3]!] = source
  }

  return steps
}

/** Resolve the neighbouring step slugs for prev/next navigation. */
export function stepSurroundings(
  slugs: string[],
  current: string,
): { prev: string | undefined; next: string | undefined } {
  const index = slugs.indexOf(current)
  if (index === -1) return { prev: undefined, next: undefined }

  return { prev: slugs[index - 1], next: slugs[index + 1] }
}
