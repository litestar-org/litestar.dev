export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    // colorMode: {
    //   preference: 'light',
    // },
    colors: {
      primary: 'litestar',
      secondary: 'litestar-secondary',
    },
    pageHero: {
      slots: {
        container: 'py-10 sm:py-20 lg:py-20',
        title: 'sm:text-5xl',
      },
    },
    // Panels are flush, so the handle draws the line between them.
    splitter: {
      slots: {
        handle:
          'border-default transition-colors hover:border-primary data-[resize-handle-state=drag]:border-primary',
      },
      variants: {
        orientation: {
          horizontal: { handle: 'border-e' },
          vertical: { handle: 'border-b' },
        },
      },
    },
    prose: {
      img: {
        base: 'w-full',
      },
      codeTree: {
        slots: {
          root: 'bg-default m-0',
          content: '[&>div>pre]:rounded-r-none',
        },
      },
    },
  },
})
