<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'
import MarkdownIt from 'markdown-it'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

const markdown = new MarkdownIt()

let text = ref<string>('')

let textJson: ComputedRef<string> = computed(() => {
  return JSON.stringify(text.value)
})

let textMarkdown = computed(() => {
  return markdown.render(text.value)
})
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="freetext" title="Title/Abstract/Lineage" />
    <div class="flex mb-2">
      <form class="w-1/2 pr-2 flex flex-col">
        <div class="text-gray-500">Input</div>
        <textarea
          class="w-full border border-black flex-grow"
          name="freetext"
          id="freetext"
          v-model="text"
        ></textarea>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <div class="text-gray-500">Preview</div>
        <div
          class="w-full border border-gray-400 prose lg:prose-lg max-w-none flex-grow"
          v-html="textMarkdown"
        ></div>
      </div>
    </div>
    <Output :data="textJson"></Output>
  </section>
</template>
