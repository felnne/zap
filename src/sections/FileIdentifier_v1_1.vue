<script setup lang="ts">
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'

const uuid = uuidv4()

const emit = defineEmits<{
  'update:fileIdentifier': [id: string]
}>()

onMounted(() => {
  emit('update:fileIdentifier', uuid)
})
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.1" anchor="file-identifier" title="File identifier" />
    <Output id="file-identifier-output" :data="uuid"></Output>
  </SectionBorder>
</template>
