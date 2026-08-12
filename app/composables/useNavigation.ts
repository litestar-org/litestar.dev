import { createSharedComposable } from '@vueuse/core'
function _useHeaderLinks() {
  const headerLinks = computed(() => {
    return [
      {
        label: 'Documentation',
        icon: 'i-lucide-book-marked',
        to: 'https://docs.litestar.dev/',
        target: '_blank',
        search: false,
      },
      // {
      //   label: 'Tutorial',
      //   icon: 'i-lucide-graduation-cap',
      //   to: '#',
      //   search: false,
      //   disabled: true,
      // },
      {
        label: 'Plugins',
        to: '/plugins',
        icon: 'i-lucide-puzzle',
        search: false,
      },
      // {
      //   label: 'Deploy',
      //   to: '/deploy',
      //   icon: 'i-lucide-rocket',
      //   search: false,
      // },
      {
        label: 'Templates',
        icon: 'i-lucide-app-window',
        to: '/templates',
        search: false,
      },
      {
        label: 'Blog',
        icon: 'i-lucide-newspaper',
        to: '/blog',
      },
      {
        label: 'About',
        icon: 'i-lucide-building-2',
        to: '/about',
        search: false,
      },
    ]
  })

  return { headerLinks }
}

export const useHeaderLinks = import.meta.client
  ? createSharedComposable(_useHeaderLinks)
  : _useHeaderLinks

const footerLinks = [
  {
    label: 'Framework',
    children: [
      {
        label: 'Documentation',
        to: 'https://docs.litestar.dev/',
        target: '_blank',
      },
      {
        label: 'Changelog',
        to: 'https://docs.litestar.dev/latest/release-notes/changelog.html',
        target: '_blank',
      },
      {
        label: 'API Reference',
        to: 'https://docs.litestar.dev/latest/reference/index.html',
        target: '_blank',
      },
    ],
  },
  {
    label: 'Ecosystem',
    children: [
      {
        label: 'Plugins',
        to: '/plugins',
      },
      {
        label: 'Templates',
        to: '/templates',
      },
      // {
      //   label: 'Deploy',
      //   to: '/deploy',
      // },
    ],
  },
  {
    label: 'Community',
    children: [
      {
        label: 'About',
        to: '/about',
      },
      {
        label: 'Blog',
        to: '/blog',
      },
      {
        label: 'Sponsor us',
        to: 'https://github.com/sponsors/litestar-org',
        target: '_blank',
      },
    ],
  },
]

export const useFooterLinks = () => ({ footerLinks })

const _useNavigation = () => {
  const nuxtApp = useNuxtApp()
  const searchTerm = ref<string>('')

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()

  const searchLinks = computed(() => [
    {
      label: 'Ask AI',
      icon: 'i-lucide-wand',
      to: 'javascript:void(0);',
      onSelect: () => nuxtApp.$kapa?.openModal(),
    },
    ...headerLinks.value
      .map((link) => {
        // Remove `/docs` and `/enterprise` links from command palette
        if (link.search === false) {
          return {
            label: link.label,
            icon: link.icon,
            children: link.children,
          }
        }
        return link
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link)),
    {
      label: 'Team',
      icon: 'i-lucide-users',
      to: '/team',
    },
    {
      label: 'Design Kit',
      icon: 'i-lucide-palette',
      to: '/design-kit',
    },
    {
      label: 'Newsletter',
      icon: 'i-lucide-mail',
      to: '/newsletter',
    },
  ])

  type SearchGroup = {
    id: string
    label: string
    icon?: string
    items: Array<{
      id: string
      label: string
      suffix?: string
      icon?: string
      avatar?: {
        src?: string
        ui?: {
          root: string
        }
      }
      to: string
      onSelect?: () => Promise<void>
    }>
  }

  const searchGroups = computed<SearchGroup[]>(() => {
    const aiGroup: SearchGroup = {
      id: 'ask-ai-search',
      label: 'AI',
      icon: 'i-lucide-wand',
      items: [],
    }

    const pluginsGroup: SearchGroup = {
      id: 'plugins-search',
      label: 'Plugins',
      items: [],
    }

    const hostingGroup: SearchGroup = {
      id: 'hosting-search',
      label: 'Hosting',
      items: [],
    }

    const groups = [aiGroup, pluginsGroup, hostingGroup]

    if (!searchTerm.value) {
      return groups
    }

    aiGroup.items = [
      {
        id: `ask-ai-${searchTerm.value}`,
        label: `Ask AI about "${searchTerm.value}"`,
        icon: 'i-lucide-wand',
        to: 'javascript:void(0);',
        onSelect() {
          return nuxtApp.$kapa.openModal(searchTerm.value)
        },
      },
    ]

    const loadPlugins = async () => {
      const { plugins, fetchList } = usePlugins()
      if (!plugins.value.length) {
        await fetchList()
      }

      pluginsGroup.items = plugins.value
        .filter((plugin) =>
          ['name', 'pypi', 'repo']
            .map((field) => plugin[field as keyof typeof plugin])
            .filter(Boolean)
            .some(
              (value) =>
                typeof value === 'string' &&
                value.search(searchTextRegExp(searchTerm.value)) !== -1,
            ),
        )
        .map((plugin) => ({
          id: `plugin-${plugin.name}`,
          label: plugin.pypi,
          suffix: plugin.description,
          avatar: {
            src: pluginImage(plugin.icon),
            ui: {
              root: 'rounded-none bg-transparent',
            },
          },
          to: `/plugins/${plugin.name}`,
        }))
    }

    const loadHosting = async () => {
      const { providers, fetchList } = useHostingProviders()
      if (!providers.value.length) {
        await fetchList()
      }

      hostingGroup.items = providers.value
        .filter((hosting) =>
          ['title']
            .map((field) => hosting[field as keyof typeof hosting])
            .filter(Boolean)
            .some(
              (value) =>
                typeof value === 'string' &&
                value.search(searchTextRegExp(searchTerm.value)) !== -1,
            ),
        )
        .map((hosting) => ({
          id: `hosting-${hosting.path}`,
          label: hosting.title,
          suffix: hosting.description,
          icon: hosting.logoIcon,
          avatar: hosting.logoSrc
            ? {
                src: hosting.logoSrc,
                ui: {
                  root: 'rounded-none bg-transparent',
                },
              }
            : undefined,
          to: hosting.path,
        }))
    }

    onMounted(() => {
      Promise.all([loadPlugins(), loadHosting()]).catch((error) =>
        console.error('Error loading search results:', error),
      )
    })

    return groups
  })

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups,
  }
}

export const useNavigation = import.meta.client
  ? createSharedComposable(_useNavigation)
  : _useNavigation
