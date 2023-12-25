<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'

type TocItem = {
  anchor: string
  name: string
}

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
    <div class="grid grid-cols-2 gap-2">
      <a
        v-for="item in items"
        :key="item.anchor"
        :href="`#${item.anchor}`"
        class="block text-blue-600 hover:underline"
        >{{ item.name }}</a
      >
    </div>
  </aside>
</template>
