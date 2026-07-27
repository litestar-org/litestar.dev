<script lang="ts" setup>
// import { link } from '#build/ui'
import { LazyMDC } from '#components'
import type { TabsItem } from '@nuxt/ui'
import LitestarWorkflow from '~/components/vueFlow/LitestarWorkflow.vue'
// import { defaultJavaScriptRegexConstructor } from 'shiki'

definePageMeta({
  heroBackground: '-z-10',
})

const [
  { data: page },
  { data: starters },
  { data: templates },
  { data: plugins },
  { data: sponsors },
] = await Promise.all([
  useAsyncData('index', () => queryCollection('index').first()),
  useAsyncData('starters', () => queryCollection('starters').all()),
  useAsyncData('templates', () => queryCollection('templates').all()),
  useAsyncData('plugins', () => queryCollection('plugins').all()),
  useAsyncData('sponsors', () => queryCollection('sponsors').all()),
])

const { packageManagers, selectedPackageManager } = usePackageManager()

const installCommands = computed<TabsItem[]>(() =>
  packageManagers.map((pm) => ({
    label: pm.label,
    icon: pm.icon,
    content: pm.command + ' litestar',
  })),
)

// Templates tab configuration
const templateTabs = ref<TabsItem[]>([
  { label: 'Starter', items: starters, slot: 'starter' as const },
  { label: 'Templates', items: templates, slot: 'templates' as const },
])

const { stats } = useStats()

const tabs = computed(() =>
  page.value?.hero.tabs.map((tab) => ({
    label: tab.title,
    icon: tab.icon,
    content: tab.content,
  })),
)

const officialPluginsLitestar = computed(
  () => plugins.value?.filter((plugin) => plugin.type === 'official') || [],
)

const selectedTemplateTab = ref('starter')

const title = 'Litestar: The Modern Python ASGI Framework'
const description =
  'Build blazing fast APIs with automatic documentation, dependency injection, and type safety. Litestar makes complex web development simple and intuitive.'
useSeoMeta({
  title,
  titleTemplate: '%s',
  description,
  ogDescription: description,
  ogTitle: title,
  twitterTitle: title,
  twitterDescription: description,
})

defineOgImage('OgImageMain', {})
</script>

<template>
  <div v-if="page">
    <UPageHero
      class="relative"
      orientation="horizontal"
      :ui="{
        container: '!pb-20 py-24 sm:py-32 lg:py-40',
        title: 'text-5xl sm:text-6xl',
        wrapper: 'lg:min-h-[540px]',
      }"
    >
      <template #headline>
        <NuxtLink :to="page?.hero.cta.to">
          <UBadge
            variant="subtle"
            size="lg"
            class="px-3 relative rounded-full font-semibold dark:hover:bg-primary-400/15 dark:hover:ring-primary-700"
          >
            {{ page?.hero.cta.label }}
            <UIcon
              v-if="page?.hero.cta.icon"
              :name="page?.hero.cta.icon"
              class="size-4 pointer-events-none"
            />
          </UBadge>
        </NuxtLink>
      </template>

      <template #title>
        The Modern <span class="text-primary">Python</span><br />ASGI
        Framework<br /><span class="text-primary">Built to scale</span>
      </template>

      <template #description>
        <p>
          Fast APIs with automatic OpenAPI documentation, dependency injection,
          type safety, and a lot of batteries included. Litestar makes designing
          complex web apps simpler
        </p>
      </template>

      <template #links>
        <div class="flex flex-col gap-4">
          <div class="flex items-center flex-wrap gap-2">
            <UButton
              to="https://docs.litestar.dev/"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
              target="_blank"
            >
              Get started
            </UButton>
            <UButton
              to="https://github.com/litestar-org/litestar"
              target="_blank"
              size="xl"
              color="neutral"
              variant="subtle"
              leading-icon="i-simple-icons-github"
            >
              View on Github
            </UButton>
          </div>
          <UTabs
            :items="installCommands"
            color="neutral"
            :ui="{
              list: 'bg-muted/50 p-1 rounded-lg',
              trigger: 'text-sm data-[state=active]:bg-background',
              content: 'pt-2',
            }"
          >
            <template #content="{ item }">
              <UInputCopy
                :value="item.content"
                :label="item.content"
                size="xl"
              />
            </template>
          </UTabs>
        </div>
      </template>

      <UPageCard
        class="overflow-auto lg:absolute [@media(min-width:2400px)]:relative lg:-mt-16 [@media(min-width:2400px)]:mt-8 right-0 [@media(min-width:2400px)]:right-auto w-screen lg:w-[calc(50%-2rem)] [@media(min-width:2400px)]:w-full max-w-[800px] [@media(min-width:2400px)]:mx-auto rounded-none lg:rounded-l-[calc(var(--ui-radius)*4)] [@media(min-width:2400px)]:rounded-2xl -mx-4 sm:-mx-6 lg:mx-0"
        variant="subtle"
        :ui="{
          container: 'sm:pt-4.5 lg:pr-0 [@media(min-width:2400px)]:px-6 w-full',
        }"
      >
        <UTabs
          :items="tabs"
          :unmount-on-hide="false"
          :ui="{
            list: 'px-0 bg-transparent lg:pr-4 overflow-x-auto',
            trigger: 'group data-[state=active]:text-highlighted',
            indicator: 'bg-default',
            leadingIcon:
              'group-data-[state=active]:text-primary size-4 hidden sm:inline-flex',
            content:
              'lg:h-[450px] bg-default [@media(min-width:2400px)]:border-e [@media(min-width:2400px)]:border-default [@media(min-width:2400px)]:rounded-l-[calc(var(--ui-radius)*1.5)] transition-opacity duration-500 data-[state=inactive]:opacity-0 opacity-100',
          }"
        >
          <template #content="{ item, index }">
            <LazyMDC
              :value="item.content"
              :cache-key="`index-hero-tab-${index}`"
              hydrate-on-idle
            />
          </template>
        </UTabs>
      </UPageCard>
    </UPageHero>

    <USeparator />

    <UPageSection
      :title="page.development.title"
      :features="page.development.features"
      :links="page.development.links"
      orientation="horizontal"
      :ui="{
        container:
          'flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16 lg:grid-cols-[5fr_7fr] lg:items-center',
      }"
    >
      <div
        class="w-full aspect-[25/32] max-h-[640px] lg:aspect-auto lg:max-h-none lg:h-full"
      >
        <LitestarWorkflow />
      </div>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page?.features.title"
      :description="page?.features.description"
      :ui="{
        title: 'text-center',
        description: 'text-center',
        root: 'bg-gradient-to-b from-muted dark:from-muted/40 to-default',
        features: 'xl:grid-cols-4 lg:gap-10',
      }"
    >
      <template #features>
        <Motion
          v-for="(feature, index) in page?.features.features"
          :key="feature.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageCard
            v-bind="feature"
            orientation="vertical"
            target="_blank"
            class="h-full"
          />
        </Motion>
        <Motion
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * page?.features.features.length }"
          :in-view-options="{ once: true }"
          class="flex flex-col justify-center gap-4 p-4 h-full"
        >
          <span class="text-lg font-semibold">
            {{ page?.features.cta?.title }}
          </span>
          <div>
            <UButton
              :to="page?.features.cta?.to"
              :label="page?.features.cta?.label"
              trailing
              :icon="page?.features.cta?.icon"
            />
          </div>
        </Motion>
      </template>
    </UPageSection>

    <USeparator />

    <UPageSection
      :description="page.plugins.description"
      :links="page.plugins.links"
      :ui="{
        root: 'bg-gradient-to-b from-muted dark:from-muted/40 to-default',
      }"
    >
      <template #title>
        <LazyMDC
          :value="page.plugins.title"
          unwrap="p"
          cache-key="index-plugins-title"
          hydrate-never
        />
      </template>
      <UCarousel
        v-slot="{ item }"
        dots
        wheel-gestures
        arrows
        :items="officialPluginsLitestar"
        class="min-w-0"
        :ui="{
          container: 'ms-0 items-stretch',
          item: 'min-w-0 shrink-0 sm:basis-1/3 p-2',
          arrows: 'hidden 2xl:block',
        }"
      >
        <PluginItem
          v-if="item"
          :plugin="item"
          :show-badge="false"
          :is-added="false"
          class="min-h-full"
        />
      </UCarousel>
    </UPageSection>

    <!-- <USeparator />

    <UPageSection
      :title="page.templates.title"
      :description="page.templates.description"
      :links="page.templates.links"
      :features="page.templates.features"
      orientation="horizontal"
      :ui="{
        root: 'bg-gradient-to-b from-muted dark:from-muted/40 to-default',
      }"
    >
      <div class="space-y-6">
        <UTabs
          :items="templateTabs"
          color="neutral"
          :ui="{
            list: 'bg-muted/50 p-1 rounded-lg inline-flex',
            trigger: 'text-sm data-[state=active]:bg-background px-4 py-2',
            content: 'min-h-[450px]',
          }"
        >
          <template #starter="{ item }">
            <UCarousel
              v-slot="{ item }"
              loop
              dots
              wheel-gestures
              arrows
              :contain-scroll="false"
              :autoplay="{ delay: 5000 }"
              :items="starters"
              :ui="{
                container: 'py-px',
                viewport: 'px-px',
              }"
            >
              <StarterCard :starter="item" />
            </UCarousel>
          </template>
          <template #templates="{ item }">
            <UCarousel
              v-slot="{ item }"
              loop
              dots
              wheel-gestures
              arrows
              :contain-scroll="false"
              :autoplay="{ delay: 3000 }"
              :items="templates"
              :ui="{
                container: 'py-px',
                viewport: 'px-px',
              }"
            >
              <TemplateCard :template="item" />
            </UCarousel>
          </template>
        </UTabs>
      </div>
    </UPageSection> -->

    <USeparator />

    <IntegrationsSection />

    <USeparator />

    <ModelsSection />

    <USeparator />

    <StatsSection :stats="stats" :stats-data="page.stats" />

    <USeparator />

    <SponsorSection :sponsors="sponsors" :sponsors-data="page.sponsors" />
  </div>
</template>
