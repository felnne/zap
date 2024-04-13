<script setup lang="ts">
import ClipboardCopy from '@/components/bases/ClipboardCopy.vue'
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
  maxHeightClass: {
    type: String,
    default: 'max-h-96',
  },
})
</script>

<template>
  <div class="space-y-2">
    <Pre :class="maxHeightClass">{{ data }}</Pre>
    <ClipboardCopy v-if="enableCopy" :data="data" />
  </div>
</template>
