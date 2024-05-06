<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { DropdownItem } from '@/types/app'
import {summariseAbstract} from '@/lib/ai'

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

const summariseFromAbstract = () => {
  markdownInput.value = summariseAbstract(props.abstract)
}

const dependantSections: DropdownItem[] = [{ href: '#access', title: 'Access Restrictions' }]

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
        <Button id="summary-use-abstract" @click="copyFromAbstract" :disabled="props.abstract == ''"
          >Copy From Abstract</Button
        >
        <GuidanceText
          >Click to copy the abstract (if set) into the input below (replacing any existing
          value).</GuidanceText
        >
      </div>
      <div class="flex items-center space-x-2">
        <Button id="summary-use-abstract" @click="summariseFromAbstract" :disabled="props.abstract == ''">
          Summarise From Abstract
        </Button>
        <GuidanceText>Click to summary the abstract (if set) <strong>✨ using the power of AI ✨</strong> into the input below (replacing any existing value).</GuidanceText>
      </div>
      <Markdown
        input-id="summary-input"
        @update:input="(event: string) => (summary = event)"
        :input="markdownInput"
      />
    </div>
  </SectionBorder>
</template>
