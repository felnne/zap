<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'
import MarkdownIt from 'markdown-it'

import SectionTitle from './SectionTitle.vue'
import ClipboardCopy from './ClipboardCopy.vue'

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
    <form>
      <textarea name="freetext" id="freetext" v-model="text"></textarea>
    </form>
    <div v-html="textMarkdown"></div>
    <code>{{ textJson }}</code>
    <ClipboardCopy :data="textJson" />
  </section>
</template>
