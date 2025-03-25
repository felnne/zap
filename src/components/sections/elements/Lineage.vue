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
      :stability="Stability.Stable"
      version="1.4"
      anchor="lineage"
      title="Lineage"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#lineage"
    />
    <Markdown input-id="lineage-input" @update:input="(event: string) => (statement = event)" />
  </SectionBorder>
</template>
