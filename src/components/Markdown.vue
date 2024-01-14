<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

import Output from '@/components/Output.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import Prose from '@/components/Prose.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import TwoColumn from '@/components/TwoColumn.vue'
import Link from '@/components/Link.vue'

const markdown = new MarkdownIt()

const props = defineProps({
  input: {
    type: String,
    required: false,
  },
  inputClass: {
    type: String,
    required: false,
    default: 'min-h-60',
  },
})

const emit = defineEmits(['update:input'])

const setInput = () => {
  if (props.input) {
    text.value = props.input
  }
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
    emit('update:input', text.value)
  }
)
</script>

<template>
  <div class="space-y-4">
    <TwoColumn>
      <template v-slot:left>
        <SectionLabel
          >Input (<Link href="https://commonmark.org/help/">Markdown syntax</Link>)</SectionLabel
        >
        <FormTextarea class="w-full flex-grow" :class="inputClass" v-model="text"></FormTextarea>
      </template>
      <template v-slot:right>
        <SectionLabel text-colour-class="text-sky-500">Preview</SectionLabel>
        <Prose class="flex-grow" :content="textMarkdown"></Prose>
      </template>
    </TwoColumn>
    <Output :data="textJson"></Output>
  </div>
</template>
