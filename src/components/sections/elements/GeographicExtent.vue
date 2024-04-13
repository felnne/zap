<script setup lang="ts">
import { computed, type ComputedRef, nextTick, onMounted, ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import { getExtents, getExtent, getProjection } from '@/lib/data'
import { createExtent, createProjection } from '@/lib/extents'
import type { EsriToken, WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import GeographicExtentMap from '@/components/sections/elements/GeographicExtentMap.vue'
import GeographicExtentGlobe from '@/components/sections/elements/GeographicExtentGlobe.vue'

defineProps({
  esriToken: {
    type: Object as () => EsriToken,
    required: false,
  },
})

const emit = defineEmits<{
  'update:isoExtent': [id: Extent]
}>()

const extentIdentifier = 'bounding'
const wellKnownExtents = getExtents()

let selectedWkeSlug = ref<string>(wellKnownExtents[0].slug)
let renderMaps = ref<boolean>(true)

let wellKnownExtent: ComputedRef<WellKnownExtent> = computed(() => {
  return getExtent(selectedWkeSlug.value)
})

let extent: ComputedRef<Extent> = computed(() => {
  return createExtent(wellKnownExtent.value, extentIdentifier)
})

let projection: ComputedRef<ReferenceSystemInfo> = computed(() => {
  return createProjection(getProjection(wellKnownExtent.value.projectionSlug))
})

onMounted(() => {
  emit('update:isoExtent', extent.value)
})

watch(wellKnownExtent, async () => {
  // crude way to update maps when extent changes
  renderMaps.value = false
  await nextTick()
  renderMaps.value = true
})

watch(extent, () => {
  emit('update:isoExtent', extent.value)
})
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="4.0"
      :stability="Stability.Experimental"
      anchor="spatial-extent"
      title="Spatial extent"
      sub-title="Well-known extents"
    />
    <div class="space-y-4">
      <TwoColumn>
        <template v-slot:left>
          <div class="space-y-2">
            <FormLabel v-for="wke in wellKnownExtents" :key="wke.slug">
              <input
                type="radio"
                name="extents"
                :id="'extent-' + wke.slug"
                :value="wke.slug"
                v-model="selectedWkeSlug"
              />
              {{ wke.name }}
            </FormLabel>
          </div>
        </template>
        <template v-slot:right>
          <div class="space-y-4">
            <div id="geographic-extent" class="space-y-2">
              <p>Extent:</p>
              <Output :data="extent"></Output>
            </div>
            <div id="spatial-crs" class="space-y-2">
              <p>Projection:</p>
              <Output maxHeightClass="max-h-16" :data="projection"></Output>
            </div>
          </div>
        </template>
      </TwoColumn>
      <TwoColumn>
        <template v-slot:left>
          <div class="space-y-2">
            <div class="text-sky-500">Preview (2D, EPSG:3857)</div>
            <GeographicExtentMap v-if="renderMaps" :wke="wellKnownExtent" />
          </div>
        </template>
        <template v-slot:right>
          <div class="space-y-2">
            <div class="text-sky-500">Preview (3D)</div>
            <GeographicExtentGlobe
              v-if="renderMaps"
              :wke="wellKnownExtent"
              :esri-token="esriToken"
            />
          </div>
        </template>
      </TwoColumn>
    </div>
  </SectionBorder>
</template>
@/lib/data@/lib/extents
