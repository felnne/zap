<script setup lang="ts">
import ClipboardCopy from '@/components/ClipboardCopy.vue'

defineProps({
  data: {
    type: null as any,
    required: true,
  },
  enableCopy: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="space-y-2">
    <pre
      class="text-s bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white overflow-scroll max-h-96"
      >{{ data }}</pre
    >
    <ClipboardCopy v-if="enableCopy" :data="data" />
  </div>
</template>
