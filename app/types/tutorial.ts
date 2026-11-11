import type { TutorialCollectionItem } from '@nuxt/content'
import type { ChapterLocation } from '~/utils/tutorial'

/**
 * A tutorial chapter together with the track and slug its URL uses.
 *
 * Both slugs are derived from directory names rather than stored in frontmatter
 * (see `app/utils/tutorial.ts`), so they're attached to the collection item once,
 * where the chapters are resolved.
 */
export type TutorialChapter = TutorialCollectionItem &
  ChapterLocation & {
    /** Public URL, e.g. `/tutorial/basics/hello`. `path` is the content path. */
    to: string
  }

/** A track and the chapters inside it, in reading order. */
export interface TutorialTrack {
  /** Slug from the track's directory, e.g. `basics`. */
  slug: string
  /** Display name from the track's `track.yml`, e.g. `Basic Litestar`. */
  title: string
  description: string
  /** Empty until chapters are written for the track. */
  chapters: TutorialChapter[]
}
