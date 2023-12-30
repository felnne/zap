<script setup lang="ts">
import type { TocItem } from '../types/app'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Link from '../components/Link.vue'

defineProps({
  items: {
    type: Array as () => TocItem[],
    required: true
  }
})
</script>

<template>
  <SectionBorder class="border-sky-500">
    <SectionTitle anchor="toc" title="Elements" />
    <div class="grid grid-cols-4 gap-4">
      <Link v-for="item in items" :key="item.anchor" :href="`#${item.anchor}`">{{
        item.title
      }}</Link>
    </div>
  </SectionBorder>
</template>
