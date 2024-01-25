<script setup lang="ts">
import ClipboardCopy from '@/components/ClipboardCopy.vue'
import Pre from './Pre.vue'

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
    <Pre>{{ data }}</Pre>
    <ClipboardCopy v-if="enableCopy" :data="data" />
  </div>
</template>
