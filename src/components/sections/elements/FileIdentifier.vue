<script setup lang="ts">
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'

const uuid = uuidv4()

const emit = defineEmits<{
  'update:fileIdentifier': [id: string]
  'update:isoFileIdentifier': [id: string]
}>()

onMounted(() => {
  emit('update:fileIdentifier', uuid)
  emit('update:isoFileIdentifier', uuid)
})
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :stability="Stability.Stable"
      :type="SectionType.Element"
      version="1.3"
      anchor="file-identifier"
      title="File identifier"
    />
    <Output id="file-identifier-output" :data="uuid"></Output>
  </SectionBorder>
</template>
