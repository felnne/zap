<script setup lang="ts">
import { nextTick, onMounted, type PropType, watch } from 'vue'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import { initExtentGlobe, loadCssTheme } from '@/utils/esriNoTest'

const props = defineProps({
  wke: {
    type: Object as PropType<WellKnownExtent>,
    required: true,
  },
  esriToken: {
    type: Object as () => EsriToken,
    required: false,
  },
})

const container = 'geographic-extent-globe'


watch(
  () => props.esriToken,
  async () => {
    if (props.esriToken) {
      await nextTick()
      initExtentGlobe(container, props.wke, props.esriToken)
    }
  }
)

onMounted(() => {
  loadCssTheme()
})
</script>

<template>
  </div>
</template>
