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
      class="text-s max-h-96 overflow-scroll border border-black bg-neutral-100 dark:border-white dark:bg-neutral-900"
      >{{ data }}</pre
    >
    <ClipboardCopy v-if="enableCopy" :data="data" />
  </div>
</template>
