<script setup lang="ts">
import type { Plugin } from '~/types'
import { isDefaultPluginIcon, pluginImage } from '~/composables/usePlugins'

const props = defineProps<{
  plugin: Plugin
  title: string
  description: string
}>()

const typeLabel = computed(() =>
  props.plugin.type === 'official' ? 'Official' : 'Third-Party',
)

// takumi (the v6 OG renderer) rejects Tailwind's `line-clamp` utility because it
// compiles to `display: -webkit-box`; clamp the description length here instead.
const clampedDescription = computed(() =>
  props.description.length > 120
    ? `${props.description.slice(0, 119).trimEnd()}…`
    : props.description,
)
</script>

<template>
  <div
    class="bg-gray-900 w-full h-full flex flex-col"
    style="font-family: 'Inter'"
  >
    <div class="absolute top-0 bottom-0 left-26 w-[2px] bg-gray-700" />
    <div class="absolute top-0 bottom-0 right-26 w-[2px] bg-gray-700" />
    <div class="absolute top-12 inset-x-0 h-[2px] bg-gray-700" />
    <div class="absolute bottom-12 inset-x-0 h-[2px] bg-gray-700" />
    <div class="mx-34 mt-12 h-100 flex flex-col justify-center">
      <div class="flex justify-start">
        <NuxtImg
          v-if="!isDefaultPluginIcon(plugin.icon)"
          :src="pluginImage(plugin.icon)"
          :alt="plugin.pypi"
          width="30"
          height="30"
          class="size-40"
        />
      </div>
      <h1 class="text-5xl font-semibold mb-0 flex gap-1 text-white">
        <span>{{ title }}</span>
      </h1>
      <p class="text-3xl text-gray-400">
        {{ clampedDescription }}
      </p>
    </div>
    <div
      class="mx-26 mb-16 border-y-2 border-gray-700 h-14 flex flex-row items-center"
    >
      <div
        class="h-full flex items-center border-r-2 border-gray-700 text-[#EAB308] px-6"
      >
        <Logo class="h-[40px] w-[40px] mt-2" />
      </div>
      <div
        class="h-full uppercase flex items-center border-r border-gray-700 text-[#EAB308] text-[20px] font-semibold px-6"
      >
        Litestar Plugin
      </div>

      <div
        class="h-full uppercase flex items-center border-gray-700 text-[#EAB308] text-[20px] font-semibold px-6"
      >
        {{ typeLabel }}
      </div>
    </div>
  </div>
</template>
