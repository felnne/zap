<script setup lang="ts">
import ClipboardCopy from './ClipboardCopy.vue'

defineProps({
  data: null as any,
  preClass: String
})
</script>

<template>
  <div>
    <pre :class="`text-s mb-2 bg-gray-100 overflow-scroll ${preClass}`">{{ data }}</pre>
    <ClipboardCopy :data="data" />
  </div>
</template>
