<script setup lang="ts">
import ClipboardCopy from './ClipboardCopy.vue'

defineProps({
  data: null as any
})
</script>

<template>
  <div>
    <pre class="text-s mb-2 bg-gray-100">{{ data }}</pre>
    <ClipboardCopy :data="data" />
  </div>
</template>
