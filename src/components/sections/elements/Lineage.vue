<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'

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
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="1.3"
      :stability="Stability.Stable"
      anchor="lineage"
      title="Lineage"
    />
    <Markdown input-id="lineage-input" @update:input="(event: string) => (statement = event)" />
  </SectionBorder>
</template>
