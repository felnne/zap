<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

import Output from './Output.vue'
import SectionLabel from './SectionLabel.vue';
import Prose from './Prose.vue'

const markdown = new MarkdownIt()

const props = defineProps({
  input: {
    type: String,
    required: false
  },
  inputClass: {
    type: String,
    required: false
  }
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
  <div>
    <div class="flex mb-4">
      <form class="w-1/2 pr-2 flex flex-col">
        <SectionLabel>Input</SectionLabel>
        <textarea
          :class="`w-full bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white flex-grow ${inputClass}`"
          name="freetext"
          id="freetext"
          v-model="text"
        ></textarea>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <SectionLabel class="text-sky-500">Preview</SectionLabel>
        <Prose class="flex-grow" :content="textMarkdown"></Prose>
      </div>
    </div>
    <Output :data="textJson"></Output>
  </div>
</template>
