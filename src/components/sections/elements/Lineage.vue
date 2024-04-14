<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'

const emit = defineEmits<{
  'update:isoLineageStatement': [id: string]
}>()

const statement = ref<string>('')

watch(
  () => statement.value,
  () => {
    emit('update:isoLineageStatement', statement.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.2" anchor="lineage" title="Lineage" />
    <Markdown input-id="lineage-input" @update:input="(event: string) => (statement = event)" />
  </SectionBorder>
</template>
