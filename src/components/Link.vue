<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
})

let target: ComputedRef<string> = computed(() => {
  if (props.href.startsWith('#')) {
    return '_self'
  }
  return '_blank'
})

let rel: ComputedRef<string | undefined> = computed(() => {
  if (!props.href.startsWith('#')) {
    return 'noopener noreferrer'
  }
  return undefined
})
</script>

<template>
  <a class="text-blue-700 underline dark:text-blue-500" :href="href" :target="target" :rel="rel"
    ><slot></slot
  ></a>
</template>
