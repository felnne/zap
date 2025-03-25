<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  proseClasses: {
    type: Array<string>,
    required: false,
    default: ['lg:prose-lg'],
  },
  borderColourClass: {
    type: String,
    required: false,
    default: 'border-sky-500',
  },
})

let additionalClasses: ComputedRef<string[]> = computed(() => {
  return [...props.proseClasses, props.borderColourClass]
})
</script>

<template>
  <!-- eslint disabled over use of v-html -->
  <!-- eslint-disable -->
  <div
    class="prose prose-neutral dark:prose-invert w-full max-w-none border"
    :class="additionalClasses"
    v-html="content"
  ></div>
  <!-- eslint-enable -->
</template>
