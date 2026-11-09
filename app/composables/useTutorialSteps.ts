import type { TutorialStepFiles } from '~/utils/tutorial'

/**
 * The Python sources shipped with each tutorial step.
 *
 * `files/` and `solution/` hold real `.py` files so they stay lintable and
 * testable (see test/pyodide). Vite inlines them at build time, which keeps the
 * tutorial a purely static asset — no runtime fetch, nothing extra to deploy.
 */
export const useTutorialStepFiles = (): Record<string, TutorialStepFiles> => {
  const modules = import.meta.glob('../../content/tutorial/**/*.py', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  return groupStepFiles(modules)
}
