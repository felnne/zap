<script setup lang="ts">
defineProps({
  data: null as any
})
</script>

<template>
  <button
    class="py-1 px-2 text-xs font-medium border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-400 shadow"
    :key="data"
    v-clipboard="data"
  >
    Copy
  </button>
</template>
