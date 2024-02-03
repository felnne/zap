<script setup lang="ts">
import { computed, type ComputedRef, nextTick, ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import { getExtents, getExtent, getProjection } from '@/utils/data'
import { createExtent, createProjection } from '@/utils/extents'
import type { EsriToken, WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'
import GeographicExtentMap from '@/sections/GeographicExtentMap.vue'
import GeographicExtentGlobe from '@/sections/GeographicExtentGlobe.vue'

const props = defineProps({
  esriToken: {
    type: Object as () => EsriToken,
    required: false,
  },
})

const wellKnownExtents = getExtents()

let selectedWkeSlug = ref<string>(wellKnownExtents[0].slug)
let renderMaps = ref<boolean>(true)

let wellKnownExtent: ComputedRef<WellKnownExtent> = computed(() => {
  return getExtent(selectedWkeSlug.value)
})

let extent: ComputedRef<Extent> = computed(() => {
  return createExtent(wellKnownExtent.value)
})

let projection: ComputedRef<ReferenceSystemInfo> = computed(() => {
  return createProjection(getProjection(wellKnownExtent.value.projectionSlug))
})

watch(wellKnownExtent, async () => {
  // this is a very basic way to cause maps to update
  renderMaps.value = false
  await nextTick()
  renderMaps.value = true
})
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="3.0"
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
              <Output :data="projection"></Output>
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
