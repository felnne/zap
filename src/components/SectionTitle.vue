<script setup lang="ts">
import { computed, type ComputedRef, type PropType, onMounted } from 'vue'

import { Stability } from '@/types/enum'
import type { TocItem } from '@/types/app'

import Link from '@/components/Link.vue'

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
  stability: {
    type: String as PropType<Stability>,
    default: Stability.Stable,
  },
  anchor: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: false,
  },
  guidanceHref: {
    type: String,
    required: false,
  },
})

const tocItem: TocItem = {
  anchor: props.anchor,
  title: props.title,
}

const emit = defineEmits(['update:tocItems'])

let stabilityClasses: ComputedRef<string[]> = computed(() => {
  const classes = []

  if (props.stability === Stability.Experimental) {
    classes.push('text-purple-500')
  } else if (props.stability === Stability.Stable) {
    classes.push('text-green-500')
  }

  return classes
})

onMounted(() => {
  emit('update:tocItems', tocItem)
})
</script>

<template>
  <header class="mb-5 space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex space-x-2">
        <h2 :id="anchor" class="flex-grow text-2xl font-semibold">{{ title }}</h2>
        <div class="flex flex-col justify-center">
          <div class="section-version text-[8px] text-neutral-500">{{ version }}</div>
          <div class="section-stability text-[8px]" :class="stabilityClasses">{{ stability }}</div>
        </div>
      </div>
      <div class="flex gap-4">
        <Link class="section-guidance" v-if="guidanceHref" :href="guidanceHref">View Guidance</Link>
        <Link
          class="section-top ml-auto bg-transparent no-underline dark:bg-neutral-300"
          href="#top"
          >🔝</Link
        >
      </div>
    </div>
    <h3 v-if="subTitle" class="text-xl font-semibold text-neutral-500">
      {{ subTitle }}
    </h3>
  </header>
</template>
