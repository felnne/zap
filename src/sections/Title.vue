<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Freetext from '../components/Freetext.vue'

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
      anchor="title"
      title="Title"
      guidance-href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/docs/eds-guidance.md#title"
    />
    <Freetext @update:input="title = $event" />
  </SectionBorder>
</template>
