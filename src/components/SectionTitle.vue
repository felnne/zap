<script setup lang="ts">
import { onMounted } from 'vue'

import type { TocItem } from '../types/app'

const props = defineProps({
  anchor: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const tocSection: TocItem = {
  anchor: props.anchor,
  title: props.title
}

const emit = defineEmits(['update:sections'])

onMounted(() => {
  emit('update:sections', tocSection)
})
</script>

<template>
  <header class="flex justify-between items-center mb-5">
    <h2 :id="anchor" class="text-2xl font-semibold text-gray-600">{{ title }}</h2>
    <a class="ml-auto" href="#top">🔝</a>
  </header>
</template>
