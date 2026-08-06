<script setup lang="ts">
definePageMeta({
  heroBackground: 'opacity-70 -z-10',
})

// Retrieving the data for the page, starters, and templates
const [{ data: templateData }, { data: starters }, { data: templates }] =
  await Promise.all([
    useAsyncData('templatePage', () => queryCollection('templatePage').first()),
    useAsyncData('starters', () => queryCollection('starters').all()),
    useAsyncData('templates', () => queryCollection('templates').all()),
  ])

// Creating a 404 if no data found
if (!templateData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

// Extracting title and description for SEO and OG Image
const title = templateData.value?.hero.title
const description = templateData.value?.hero.description

// SEO Meta
useSeoMeta({
  titleTemplate: '%s',
  title: title,
  description: description,
  ogDescription: description,
  ogTitle: title,
})

// Open Graph Image
defineOgImage('Page', {
  title: title,
  description: description,
})
</script>

<template>
  <UContainer>
    <UPageHero
      :title="title"
      :description="description"
      :links="templateData?.hero.links"
    >
    </UPageHero>

    <!-- <UPage>
      <UPageBody> -->
    <!-- Starter Templates Section -->
    <UPageSection
      id="starters"
      :title="templateData?.starter.title"
      :description="templateData?.starter.description"
      :ui="{
        title: 'text-left !text-3xl',
        description: 'text-left',
      }"
    >
      <template #title
        >{{ templateData?.starter.title }}
        <UBadge variant="subtle" size="xl">Coming soon</UBadge>
      </template>
      <UPageGrid>
        <StarterCard
          v-for="(starter, index) in starters"
          :key="`starter-${index}`"
          :starter="starter"
        />
      </UPageGrid>
    </UPageSection>

    <!-- </UPageBody>
    </UPage> -->

    <UPageSection
      id="templates"
      :title="templateData?.template.title"
      :description="templateData?.template.description"
      :ui="{
        title: 'text-left !text-3xl',
        description: 'text-left',
      }"
    >
      <!-- Dynamic Templates from Content Collection -->
      <UPageSection
        v-for="(template, index) in templates"
        :key="index"
        :title="template.title"
        :description="template.description"
        :links="template.links"
        :features="template.features"
        orientation="horizontal"
        class="lg:border-t border-default"
        :ui="{
          title: 'lg:text-4xl',
          wrapper: 'lg:py-16 lg:border-r border-default order-last lg:pr-16',
          container: 'lg:py-0',
          links: 'gap-x-3',
        }"
      >
        <div
          class="lg:border-x border-default h-full flex items-center lg:bg-muted/20"
        >
          <Motion
            class="flex-1"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0px)' }"
            :in-view-options="{ once: true }"
            :transition="{ duration: 0.5, delay: 0.2 }"
          >
            <UColorModeImage
              v-if="template.thumbnail"
              v-bind="template.thumbnail"
              class="w-full h-auto border lg:border-y lg:border-x-0 border-default rounded-sm lg:rounded-none"
              :alt="`Template ${index} thumbnail`"
              width="656"
              height="369"
              loading="lazy"
            />
            <UCarousel
              v-else-if="template.images"
              v-slot="{ item }"
              :items="template.images as any[]"
              dots
            >
              <NuxtImg
                v-bind="item"
                class="w-full h-full object-cover"
                width="576"
                height="360"
                loading="lazy"
              />
            </UCarousel>
          </Motion>
        </div>
      </UPageSection>
    </UPageSection>
  </UContainer>
</template>

<style>
.gradient {
  background-image: linear-gradient(105deg, #f8fafc 5.03%, #f1f5f9 102.15%);
}
.dark .gradient {
  background-image: linear-gradient(105deg, #020420 5.03%, #010211 102.15%);
}
</style>
