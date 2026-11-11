<script setup lang="ts">
/**
 * Full-viewport layout for interactive tutorial steps.
 *
 * Unlike the default layout there's no footer and no page scrolling: the step
 * page owns the space under the header and scrolls its own panes, so the editor
 * and its output stay in view while the lesson is read.
 */
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <AppHeader />

    <UMain class="relative min-h-0 flex-1">
      <NuxtPage />
    </UMain>
  </div>
</template>
