<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

import Output from '@/components/bases/Output.vue'
import SectionLabel from '@/components/bases/SectionLabel.vue'
import Prose from '@/components/bases/Prose.vue'
import FormTextarea from '@/components/bases/FormTextarea.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import Link from '@/components/bases/Link.vue'

const markdown = new MarkdownIt()

const props = defineProps({
  input: {
    type: String,
    required: false,
    default: '',
  },
  inputId: {
    type: String,
    required: false,
    default: '',
  },
  inputClass: {
    type: String,
    required: false,
    default: 'min-h-60',
  },
})

const emit = defineEmits(['update:input'])

const setInput = () => {
  if (props.input != '') {
    text.value = props.input
  }
}

const fixInput = (input: string): string => {
  return input.replace(/\\n/g, '\n')
}

const handlePaste = () => {
  setTimeout(() => {
    text.value = fixInput(text.value)
  }, 0)
}

let text = ref<string>('')

let textJson: ComputedRef<string> = computed(() => {
  return JSON.stringify(text.value)
})

let textMarkdown = computed(() => {
  return markdown.render(text.value)
})

onMounted(() => {
  setInput()
})

watch(
  () => props.input,
  () => {
    setInput()
  }
)

watch(
  () => text.value,
  () => {
    console.log('text.value', text.value)
    emit('update:input', text.value)
  }
)
</script>

<template>
  <div class="space-y-4">
    <TwoColumn>
      <template #left>
        <SectionLabel
          >Input (<Link href="https://commonmark.org/help/">Markdown syntax</Link>)</SectionLabel
        >
        <FormTextarea
          :id="inputId !== '' ? inputId : null"
          v-model="text"
          class="w-full flex-grow"
          :class="inputClass"
          @paste="handlePaste"
        ></FormTextarea>
      </template>
      <template #right>
        <SectionLabel text-colour-class="text-sky-500">Preview</SectionLabel>
        <Prose class="flex-grow" :content="textMarkdown"></Prose>
      </template>
    </TwoColumn>
    <Output :data="textJson"></Output>
  </div>
</template>
