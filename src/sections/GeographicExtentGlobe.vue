<script setup lang="ts">
import { computed, type ComputedRef, onMounted, type PropType } from 'vue'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import { getSetting } from '@/utils/data'
import { initExtentGlobe, loadCssTheme, parseToken } from '@/utils/esri'

const props = defineProps({
  wke: {
    type: Object as PropType<WellKnownExtent>,
    required: true,
  },
})

const container = 'geographic-extent-globe'



onMounted(() => {
  loadCssTheme()
  initExtentGlobe(container, props.wke, token.value)
})
</script>

<template>
  </div>
</template>
