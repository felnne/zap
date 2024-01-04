<script setup lang="ts">
import { onMounted } from 'vue'

import type { TocItem } from '@/types/app'

import Link from '@/components/Link.vue'

const props = defineProps({
  anchor: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: false
  },
  guidanceHref: {
    type: String,
    required: false
  }
})

const tocItem: TocItem = {
  anchor: props.anchor,
  title: props.title
}

const emit = defineEmits(['update:tocItems'])

onMounted(() => {
  emit('update:tocItems', tocItem)
})
</script>

<template>
  <header class="mb-5 space-y-2">
    <div class="flex justify-between items-center">
      <h2 :id="anchor" class="text-2xl font-semibold flex-grow">
        {{ title }}
      </h2>
      <div class="flex gap-4">
        <Link class="section-guidance" v-if="guidanceHref" :href="guidanceHref">View Guidance</Link>
        <Link
          class="section-top ml-auto no-underline bg-transparent dark:bg-neutral-300"
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
