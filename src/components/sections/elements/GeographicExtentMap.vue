<script setup lang="ts">
import { onMounted, type PropType } from 'vue'

import type { GeographicExtent } from '@/types/iso'
import { loadCssTheme, initExtentMap } from '@/lib/esriNoTest'

const props = defineProps({
  extent: {
    type: Object as PropType<GeographicExtent>,
    required: true,
  },
})

const container = 'geographic-extent-map'

onMounted(() => {
  loadCssTheme()
  initExtentMap(container, props.extent)
})
</script>

<template>
  <div :id="container" class="h-96 w-full border border-sky-500"></div>
</template>
