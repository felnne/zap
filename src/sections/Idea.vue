<script setup lang="ts">
defineProps({
  complete: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <article class="flex items-center space-x-2">
    <span
      class="inline-flex items-center bg-sky-50 dark:bg-sky-950 px-2 py-1 text-xs font-medium text-sky-500 dark:text-sky-300 ring-1 ring-inset ring-sky-700/10 dark:ring-sky-100/10"
      >Idea</span
    >
    <span
      v-if="complete"
      class="inline-flex items-center bg-green-50 dark:bg-green-950 px-2 py-1 text-xs font-medium text-green-500 dark:green-sky-300 ring-1 ring-inset ring-green-700/10 dark:ring-green-100/10"
      >Done</span
    >
    <div class="text-black dark:text-white"><slot></slot></div>
  </article>
</template>
