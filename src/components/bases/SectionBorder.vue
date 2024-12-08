<script setup lang="ts">
import { computed, type ComputedRef, type PropType } from 'vue'

import { SectionType } from '@/types/enum'

const props = defineProps({
  type: {
    type: String as PropType<SectionType>,
    required: true,
  },
})

let sectionTypeBorderClasses: ComputedRef<string[]> = computed(() => {
  if (props.type === SectionType.Info) return ['border-sky-500']
  if (props.type === SectionType.Tools) return ['border-black', 'dark:border-white']
  return ['border-neutral-500']
})
</script>
<template>
  <section class="border-4 p-4" :class="sectionTypeBorderClasses"><slot></slot></section>
</template>
