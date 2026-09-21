<template>
  <UPageSection
    title="Work with any Python data model"
    description="Litestar supports all popular Python data modeling libraries out of the box. Choose your favorite or mix and match based on your needs."
    :ui="{
      root: 'bg-gradient-to-b from-muted dark:from-muted/40 to-default',
      title: 'text-left',
      description: 'text-left text-lg text-muted-foreground max-w-3xl',
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      <UPageCard
        v-for="model in models"
        :key="model.name"
        class="h-full"
        variant="subtle"
        :to="model.link"
        target="_blank"
        :ui="{
          root: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl p-6',
          container: 'space-y-4',
        }"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center"
            >
              <UIcon
                :name="isDark && model.iconDark ? model.iconDark : model.icon"
                class="w-7 h-7 object-contain"
              />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              {{ model.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ model.description }}
            </p>
          </div>
        </div>
      </UPageCard>
    </div>
  </UPageSection>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

interface Model {
  name: string
  description: string
  icon: string
  link: string
  iconDark?: string
}

const models: Model[] = [
  {
    name: 'Pydantic',
    description: 'The most popular data validation library for Python.',
    icon: 'i-simple-icons-pydantic',
    link: 'https://docs.pydantic.dev/',
  },
  {
    name: 'Dataclasses',
    description:
      "Python's built-in dataclasses with full support for serialization and validation.",
    icon: 'i-lucide-box',
    link: 'https://docs.python.org/3/library/dataclasses.html',
  },
  {
    name: 'Attrs',
    description:
      'Python classes without boilerplate. Mature and battle-tested with excellent performance.',
    icon: 'i-lucide-settings',
    link: 'https://www.attrs.org/',
  },
  {
    name: 'TypedDict',
    description:
      'Type hints for dictionaries with specific key-value types and API responses.',
    icon: 'i-lucide-braces',
    link: 'https://docs.python.org/3/library/typing.html#typing.TypedDict',
  },
  {
    name: 'Msgspec',
    description:
      'Fast serialization and validation library with JSON and MessagePack support.',
    icon: 'i-custom-msgspec',
    iconDark: 'i-custom-msgspec-dark',
    link: 'https://msgspec.dev/',
  },
]
</script>
