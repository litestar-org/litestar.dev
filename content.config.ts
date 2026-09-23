import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
// import { z } from 'zod'

const TitleIconFeature = z.object({
  title: z.string(),
  icon: z.string(),
})

const Image = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const Maintainer = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  github: z.string(),
})

const DualModeImage = z.object({
  light: z.string().editor({ input: 'media' }),
  dark: z.string().editor({ input: 'media' }),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
})

const Timeline = z.object({
  date: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().editor({ input: 'icon' }).optional(),
  avatar: Image.optional(),
  value: z.union([z.string(), z.number()]).optional(),
})

const Link = z.object({
  label: z.string(),
  to: z.string(),
  icon: z.string().optional(),
})

const Button = z.object({
  label: z.string(),
  icon: z.string().optional(),
  trailingIcon: z.string().optional(),
  leadingIcon: z.string().optional(),
  to: z.string().optional(),
  color: z
    .enum(['primary', 'neutral', 'success', 'warning', 'error', 'info'])
    .optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z
    .enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
    .optional(),
  id: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
})

const BaseSection = z.object({
  title: z.string(),
  description: z.string(),
})

const Sponsor = z.object({
  title: z.string(),
  url: z.string(),
  image: Image,
})

const Author = z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  bluesky: z.string().optional(),
  to: z.string().optional(),
  avatar: Image.optional(),
})

const PageFeature = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().editor({ input: 'icon' }),
  to: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
  soon: z.boolean().optional(),
})

const PageSection = BaseSection.extend({
  links: z.array(Button),
  features: z.array(PageFeature),
  image: DualModeImage,
  cta: z
    .object({
      title: z.string(),
      label: z.string(),
      to: z.string(),
      icon: z.string(),
    })
    .optional(),
})

const PageHero = BaseSection.extend({
  image: DualModeImage.optional(),
  head: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  headline: z
    .object({
      label: z.string(),
      to: z.string(),
      icon: z.string().optional().editor({ input: 'icon' }),
    })
    .optional(),
  links: z.array(Button).optional(),
  cta: Link.optional(),
})

const Template = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  thumbnail: DualModeImage,
  images: z.array(Image).optional(),
  features: z.array(TitleIconFeature).optional(),
  links: z.array(Button).optional(),
})

// One entry of the litestar-templates manifest (templates.json). `name` is
// also the CLI slug; the GitHub URL derives from `directory`.
const StarterTemplate = z.object({
  name: z.string(),
  directory: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().editor({ input: 'icon' }),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

const Plugin = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  pypi: z.string(),
  repo: z.string(),
  github: z.string(),
  website: z.string(),
  documentation: z.string(),
  category: z.string(),
  type: z.string(),
  maintainers: z.array(
    z.object({
      name: z.string(),
      github: z.string(),
      avatar: z.string().optional(),
    }),
  ),
  compatibility: z.object({
    litestar: z.string().optional(),
  }),
  icon: z.string(),
  license: z.string().optional(),
  stars: z.number().optional(),
  monthly_downloads: z.number().optional(),
  latest_version: z.string().optional(),
  updated_at: z.string().optional(),
  created_at: z.string().optional(),
  python_compatibility_raw: z.string().optional(),
  python_compatibility: z
    .object({
      raw: z.string(),
      specifier_set: z.string(),
      compatible: z.array(z.string()).optional(),
    })
    .optional(),
  changelog: z.string().optional(),
  issues: z.string().optional(),
  sponsor: z.boolean().optional(),
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'data',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          title: z.string(),
          description: z.string(),
          cta: Link.extend({
            icon: z.string(),
          }),
          tabs: z.array(
            z.object({
              title: z.string(),
              icon: z.string(),
              content: z.string(),
            }),
          ),
        }),
        logos: z.object({
          title: z.string(),
          companies: z.array(DualModeImage),
        }),
        features: PageSection,
        development: PageSection.extend({
          code: z.string(),
        }),
        templates: PageSection,
        plugins: PageSection,
        deploy: PageSection,
        stats: PageSection.extend({
          community: BaseSection,
          x: z.number(),
          discord: z.string(),
          cta: Button,
        }),
        sponsors: PageSection.extend({
          cta: Button,
        }),
      }),
    }),
    about: defineCollection({
      type: 'data',
      source: 'about.yml',
      schema: z.object({
        hero: z.object({
          title: z.string(),
          description: z.string(),
        }),
        organization: PageSection,
        maintainers: PageSection.extend({
          acknowledgment: z.string(),
        }),
        history: PageSection.extend({
          timeline: z.array(Timeline),
        }),
        contributing: PageSection,
      }),
    }),
    templatePage: defineCollection({
      type: 'data',
      source: 'template.yml',
      schema: z.object({
        hero: PageHero,
        starter: PageSection,
        template: PageSection,
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*',
      schema: z.object({
        image: z.string().editor({ input: 'media' }),
        authors: z.array(Author),
        date: z.string().date(),
        category: z.enum(['Release', 'Tutorial', 'Announcement', 'Article']),
        tags: z.array(z.string()),
        // Source blog posts into sitemap.xml directly from the collection (built
        // at parse time, so it works in dev and in `nuxt generate` regardless of
        // link-crawling). Draft posts live on non-main branches, so anything that
        // reaches the live build is publishable.
        sitemap: defineSitemapSchema(),
      }),
    }),
    deploy: defineCollection({
      type: 'page',
      source: 'deploy/*',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        componentImg: z.string(),
        logoSrc: z.string(),
        featured: z.boolean(),
        logoIcon: z.string(),
        category: z.string(),
        nitroPreset: z.string(),
        website: z.string().url(),
      }),
    }),
    templates: defineCollection({
      type: 'data',
      source: 'templates/*',
      schema: Template,
    }),
    maintainers: defineCollection({
      type: 'data',
      source: 'maintainers/*',
      schema: Maintainer,
    }),
    readme: defineCollection({
      type: 'data',
      source: {
        repository: 'https://github.com/litestar-org/plugin-registry',
        include: 'readmes/*.md',
        // Authenticate the clone so it uses GitHub's 5000/h limit instead of
        // the ~60/h anonymous one (avoids throttling). No-op if unset.
        authToken: process.env.GITHUB_TOKEN,
      },
    }),
    plugins: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/litestar-org/plugin-registry',
        include: 'plugins/*.yml',
        // Authenticate the clone so it uses GitHub's 5000/h limit instead of
        // the ~60/h anonymous one (avoids throttling). No-op if unset.
        authToken: process.env.GITHUB_TOKEN,
      },
      // Source plugin detail pages into sitemap.xml from the collection so they
      // don't depend on prerender link-crawling to be discovered.
      schema: Plugin.extend({ sitemap: defineSitemapSchema() }),
    }),
    sponsors: defineCollection({
      type: 'page',
      source: 'sponsors/*.yml',
      schema: Sponsor,
    }),
    starters: defineCollection({
      type: 'data',
      source: {
        // Single source of truth: the starter registry lives in the
        // litestar-templates repo alongside the starters themselves.
        // TODO: switch back to litestar-org/litestar-templates once that
        // repo is public (Kumzy/* is a temporary public test mirror).
        repository: 'https://github.com/Kumzy/litestar-templates',
        include: 'templates.json',
        // Authenticate the clone so it uses GitHub's 5000/h limit instead of
        // the ~60/h anonymous one (avoids throttling). No-op if unset.
        authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({
        templates: z.array(StarterTemplate),
      }),
    }),
  },
})
