<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Markdown from '@/components/Markdown.vue'

const emit = defineEmits<{
  'update:isoAbstract': [id: string]
}>()

const abstract = ref<string>('')

watch(
  () => abstract.value,
  () => {
    emit('update:isoAbstract', abstract.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.0" anchor="abstract" title="Abstract" />
    <Markdown input-id="abstract" @update:input="(event: string) => (abstract = event)" />
  </SectionBorder>
</template>
