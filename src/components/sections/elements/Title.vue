<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'

const emit = defineEmits<{
  'update:title': [id: string]
  'update:isoTitleValue': [id: string]
}>()

const title = ref<string>('')

watch(
  () => title.value,
  () => {
    emit('update:title', title.value)
    emit('update:isoTitleValue', title.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="1.4"
      anchor="title"
      title="Title"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#title"
    />
    <Markdown
      input-id="title-input"
      input-class="min-h-10"
      @update:input="(event: string) => (title = event)"
    />
  </SectionBorder>
</template>
