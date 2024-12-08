<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'

const emit = defineEmits<{
  'update:abstract': [id: string]
  'update:isoAbstract': [id: string]
}>()

const abstract = ref<string>('')

watch(
  () => abstract.value,
  () => {
    emit('update:abstract', abstract.value)
    emit('update:isoAbstract', abstract.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="1.2"
      :stability="Stability.Stable"
      anchor="abstract"
      title="Abstract"
    />
    <Markdown input-id="abstract-input" @update:input="(event: string) => (abstract = event)" />
  </SectionBorder>
</template>
