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
  },
  guidanceHref: {
    type: String,
    required: false
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
    <h2 :id="anchor" class="text-2xl font-semibold text-gray-600 dark:text-gray-100 flex-grow">
      {{ title }}
    </h2>
    <div class="flex gap-4">
      <a
        v-if="guidanceHref"
        class="text-blue-600 dark:text-blue-200 underline"
        :href="guidanceHref"
        target="_blank"
        rel="noopener noreferrer"
        >View Guidance</a
      >
      <a class="ml-auto bg-transparent dark:bg-gray-200" href="#top">🔝</a>
    </div>
  </header>
</template>
