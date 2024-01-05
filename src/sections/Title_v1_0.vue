<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Markdown from '@/components/Markdown.vue'

const emit = defineEmits(['update:title'])

const title = ref<string>('')

watch(
  () => title.value,
  () => {
    emit('update:title', title.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="1.0"
      anchor="title"
      title="Title"
      guidance-href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/docs/eds-guidance.md#title"
    />
    <Markdown input-class="min-h-10" @update:input="title = $event" />
  </SectionBorder>
</template>
