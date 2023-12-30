<script setup lang="ts">
import ClipboardCopy from './ClipboardCopy.vue'

defineProps({
  data: null as any,
})
</script>

<template>
  <div class="space-y-2">
    <pre
      class="text-s bg-gray-100 dark:bg-gray-900 text-black dark:text-white overflow-scroll max-h-96"
      >{{ data }}</pre
    >
    <ClipboardCopy :data="data" />
  </div>
</template>
