<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { DropdownItem } from '@/types/app'
import { summariseAbstract } from '@/lib/ai'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Markdown from '@/components/bases/Markdown.vue'
import Button from '@/components/bases/Button.vue'

const props = defineProps({
  abstract: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:summary': [id: string]
  'update:isoPurpose': [id: string]
}>()

const copyFromAbstract = () => {
  markdownInput.value = props.abstract
}

const summariseFromAbstract = async () => {
  markdownInput.value = '[Generating summary...]'
  try {
    markdownInput.value = await summariseAbstract(props.abstract)
  } catch {
    markdownInput.value = '[Error generating summary]'
    return
  }
}

const dependantSections: DropdownItem[] = [{ href: '#abstract', title: 'Abstract' }]

let summary = ref<string>('')
let markdownInput = ref<string>('')

watch(
  () => summary.value,
  () => {
    emit('update:summary', summary.value)
    emit('update:isoPurpose', summary.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="1.0"
      :stability="Stability.Experimental"
      anchor="summary"
      title="Summary"
      :add-toc="true"
      :depends-on="dependantSections"
    />
    <div class="space-y-4">
      <div class="flex items-center space-x-2">
        <Button id="summary-use-abstract" :disabled="props.abstract == ''" @click="copyFromAbstract"
          >Copy From Abstract</Button
        >
        <GuidanceText
          >Click to copy the abstract (if set) into the input below (replacing any existing
          value).</GuidanceText
        >
      </div>
      <div class="flex items-center space-x-2">
        <Button
          id="summary-use-abstract-ai"
          :disabled="props.abstract == ''"
          @click="summariseFromAbstract"
        >
          Summarise From Abstract ✨
        </Button>
        <GuidanceText
          >Click to summarise the abstract (if set) using AI into the input below (replacing any
          existing value).</GuidanceText
        >
      </div>
      <Markdown
        input-id="summary-input"
        :input="markdownInput"
        @update:input="(event: string) => (summary = event)"
      />
    </div>
  </SectionBorder>
</template>
