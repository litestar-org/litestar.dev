import type { TutorialChapter, TutorialTrack } from '~/types'

/**
 * Every tutorial chapter, and the tracks they belong to.
 *
 * Tracks come from their own `track.yml`, so one with no chapters yet still
 * shows up. Ordering comes from the content paths, which carry the `NN-`
 * prefixes of both the track and the chapter directory — reading order is
 * whatever the filesystem says, with no `order` field to keep in sync.
 */
export const useTutorialChapters = async () => {
  const [{ data: trackData }, { data: chapterData }] = await Promise.all([
    useAsyncData('tutorial-tracks', () =>
      queryCollection('tutorialTracks').order('stem', 'ASC').all(),
    ),
    useAsyncData('tutorial-chapters', () =>
      queryCollection('tutorial').order('path', 'ASC').all(),
    ),
  ])

  const chapters = computed<TutorialChapter[]>(() =>
    (chapterData.value ?? []).flatMap((item) => {
      const location = chapterFromPath(item.path)
      return location ? [{ ...item, ...location }] : []
    }),
  )

  const tracks = computed<TutorialTrack[]>(() =>
    (trackData.value ?? []).flatMap((item) => {
      const slug = trackSlugFromStem(item.stem)
      if (!slug) return []

      return [
        {
          slug,
          title: item.title,
          description: item.description,
          chapters: chapters.value.filter(
            (chapter) => chapter.trackSlug === slug,
          ),
        },
      ]
    }),
  )

  return { chapters, tracks }
}
