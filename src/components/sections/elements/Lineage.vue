<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'

const emit = defineEmits<{
  'update:isoLineage': [id: string]
}>()

const lineage = ref<string>('')

watch(
  () => lineage.value,
  () => {
    emit('update:isoLineage', lineage.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.1" anchor="lineage" title="Lineage" />
    <Markdown input-id="lineage-input" @update:input="(event: string) => (lineage = event)" />
  </SectionBorder>
</template>
