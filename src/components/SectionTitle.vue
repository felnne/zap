<script setup lang="ts">
import { onMounted } from 'vue'

type TocSection = {
  anchor: string
  title: string
}

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

const tocSection: TocSection = {
  anchor: props.anchor,
  title: props.title
}

const emit = defineEmits(['update:sections'])

onMounted(() => {
  emit('update:sections', tocSection)
})
</script>

<template>
  <header>
    <h2 :id="anchor" class="text-2xl font-semibold text-gray-600 mb-5">{{ title }}</h2>
    <a href="#top">🔝</a>
  </header>
</template>
