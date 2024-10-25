<script setup lang="ts">
import { nextTick, onMounted, type PropType, watch } from 'vue'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import { initExtentGlobe, loadCssTheme } from '@/lib/esriNoTest'

import Link from '@/components/bases/Link.vue'

const props = defineProps({
  wke: {
    type: Object as PropType<WellKnownExtent>,
    required: true,
  },
  esriToken: {
    type: Object as () => EsriToken | undefined,
    required: false,
    default: undefined,
  },
})

const container = 'geographic-extent-globe'

const classes = 'h-96 w-full border border-sky-500'

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
  <div
    v-if="!esriToken"
    :id="container"
    class="flex items-center justify-center text-lg"
    :class="classes"
  >
    <p>
      Sign in to ArcGIS Online in <Link href="#external-services">External Services</Link> to show
      3D preview.
    </p>
  </div>
  <div v-else :id="container" :class="classes"></div>
</template>
