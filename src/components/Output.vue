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
      class="text-s bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white overflow-scroll max-h-96"
      >{{ data }}</pre
    >
    <ClipboardCopy :data="data" />
  </div>
</template>
