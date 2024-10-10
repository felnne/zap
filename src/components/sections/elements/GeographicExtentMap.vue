<script setup lang="ts">
import { onMounted, type PropType } from 'vue'

import type { WellKnownExtent } from '@/types/app'
import { loadCssTheme, initExtentMap } from '@/lib/esriNoTest'

const props = defineProps({
  wke: {
    type: Object as PropType<WellKnownExtent>,
    required: true,
  },
})

const container = 'geographic-extent-map'

onMounted(() => {
  loadCssTheme()
  initExtentMap(container, props.wke)
})
</script>

<template>
  <div :id="container" class="h-96 w-full border border-sky-500"></div>
</template>
@/lib/esriNoTest
