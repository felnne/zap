<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import type { TocItem } from '../types/app'

defineProps({
  items: {
    type: Array as () => TocItem[],
    required: true
  }
})
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-sky-500">
    <SectionTitle anchor="toc" title="Elements" />
    <div class="grid grid-cols-4 gap-2">
      <a
        v-for="item in items"
        :key="item.anchor"
        :href="`#${item.anchor}`"
        class="block underline text-blue-600 dark:text-blue-200"
        >{{ item.title }}</a
      >
    </div>
  </aside>
</template>
