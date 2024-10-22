<script setup lang="ts">
import type { Idea } from '@/types/app'

defineProps({
  idea: {
    type: Object as () => Idea,
    required: true,
  },
})
</script>

<template>
  <article class="flex items-center space-x-2">
    <span
      class="inline-flex items-center bg-sky-50 px-2 py-1 text-xs font-medium text-sky-500 ring-1 ring-inset ring-sky-700/10 dark:bg-sky-950 dark:ring-sky-100/10"
      >Idea</span
    >
    <span
      v-if="idea.state === 'complete'"
      class="inline-flex items-center bg-green-50 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-700/10 dark:bg-green-950 dark:ring-green-100/10"
      >Done</span
    >
    <span
      v-if="idea.state === 'cancelled'"
      class="inline-flex items-center bg-red-50 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-700/10 dark:bg-yellow-950 dark:ring-yellow-100/10"
      >Cancelled</span
    >
    <span
      v-if="idea.state === 'removed'"
      class="inline-flex items-center bg-red-50 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-700/10 dark:bg-red-950 dark:ring-red-100/10"
      >Removed</span
    >
    <div class="text-black dark:text-white">{{ idea.label }}</div>
  </article>
</template>
