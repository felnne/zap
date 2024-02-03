<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  forceInternal: {
    type: Boolean,
    default: false,
    required: false,
  },
})

let target: ComputedRef<string> = computed(() => {
  if (props.href.startsWith('#') || props.forceInternal) {
    return '_self'
  }
  return '_blank'
})

let rel: ComputedRef<string | undefined> = computed(() => {
  if (props.href.startsWith('#') || props.forceInternal) {
    return undefined
  }

  return 'noopener noreferrer'
})
</script>

<template>
  <a class="text-blue-700 underline dark:text-blue-500" :href="href" :target="target" :rel="rel"
    ><slot></slot
  ></a>
</template>
