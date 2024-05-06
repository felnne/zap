<script setup lang="ts">
import { computed, type ComputedRef, type PropType } from 'vue'

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
  classes: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
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
  <a
    class="text-blue-700 underline dark:text-blue-500"
    :class="classes"
    :href="href"
    :target="target"
    :rel="rel"
    ><slot></slot
  ></a>
</template>
