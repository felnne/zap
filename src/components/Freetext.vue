<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'

import Output from './Output.vue'

const markdown = new MarkdownIt()

const props = defineProps({
  initialInput: {
    type: String,
    required: false
  },
  inputClass: {
    type: String,
    required: false
  }
})

let text = ref<string>('')

let textJson: ComputedRef<string> = computed(() => {
  return JSON.stringify(text.value)
})

let textMarkdown = computed(() => {
  return markdown.render(text.value)
})

onMounted(() => {
  if (props.initialInput) {
    text.value = props.initialInput
  }
})
</script>

<template>
  <div>
    <div class="flex mb-4">
      <form class="w-1/2 pr-2 flex flex-col">
        <div class="text-gray-500 dark:text-gray-300">Input</div>
        <textarea
          :class="`w-full bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white flex-grow ${inputClass}`"
          name="freetext"
          id="freetext"
          v-model="text"
        ></textarea>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <div class="text-gray-500 dark:text-gray-300">Preview</div>
        <div
          class="w-full p-2 border border-gray-400 prose lg:prose-lg max-w-none flex-grow"
          v-html="textMarkdown"
        ></div>
      </div>
    </div>
    <Output :data="textJson"></Output>
  </div>
</template>
