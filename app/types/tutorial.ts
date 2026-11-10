import type { TutorialCollectionItem } from '@nuxt/content'

/**
 * A tutorial step together with the slug its URL uses.
 *
 * The slug is derived from the step's directory name rather than stored in
 * frontmatter (see `app/utils/tutorial.ts`), so it's attached to the collection
 * item once, where the chapters are resolved.
 */
export type TutorialChapter = TutorialCollectionItem & { slug: string }
