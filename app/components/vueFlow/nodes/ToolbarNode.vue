<script setup lang="ts">
import type { Position } from '@vue-flow/core'

defineProps<{
  id: string
  data: {
    label: string
    tooltip: string
    toolbarPosition: Position
  }
}>()
</script>

<template>
  <UPopover
    mode="hover"
    :enable-touch="true"
    :content="{
      side: data.toolbarPosition,
      collisionPadding: 8,
    }"
  >
    <div class="flex size-full items-center justify-center">
      {{ data.label }}
    </div>

    <template #content>
      <div
        class="max-w-[350px] max-h-[400px] overflow-y-auto p-3 text-xs leading-relaxed whitespace-pre-line"
        v-html="data.tooltip"
      ></div>
    </template>
  </UPopover>
</template>
