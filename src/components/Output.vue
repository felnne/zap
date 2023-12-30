<script setup lang="ts">
import ClipboardCopy from './ClipboardCopy.vue'

defineProps({
  data: {
    type: null as any,
    required: true
  }
})
</script>

<template>
  <div class="space-y-2">
    <pre
      class="text-s bg-gray-100 dark:bg-gray-900 border border-black dark:border-white overflow-scroll max-h-96"
      >{{ data }}</pre
    >
    <ClipboardCopy :data="data" />
  </div>
</template>
