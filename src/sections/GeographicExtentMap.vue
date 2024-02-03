<script setup lang="ts">
import { onMounted, type PropType } from 'vue'

import type { WellKnownExtent } from '@/types/app'
import { loadCssTheme, initExtentMap } from '@/utils/esriNoTest'

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
  <div class="h-96 w-full border border-sky-500" :id="container"></div>
</template>
