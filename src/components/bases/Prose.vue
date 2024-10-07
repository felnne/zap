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
  <div
    class="prose prose-neutral w-full max-w-none border dark:prose-invert"
    :class="additionalClasses"
    v-html="content"
  ></div>
</template>
