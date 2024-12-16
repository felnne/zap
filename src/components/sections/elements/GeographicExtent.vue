<script setup lang="ts">
import { computed, type ComputedRef, nextTick, onMounted, ref, watch } from 'vue'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import type { GeographicExtent, ReferenceSystemInfo } from '@/types/iso'
import { Stability, SectionType } from '@/types/enum'
import { getExtents, getExtent, getProjection } from '@/lib/data'
import { createProjection } from '@/lib/extents'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import ThreeColumn from '@/components/bases/ThreeColumn.vue'
import GeographicExtentMap from '@/components/sections/elements/GeographicExtentMap.vue'

defineProps({
  esriToken: {
    type: Object as () => EsriToken | undefined,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits<{
  'update:isoExtentGeographic': [id: GeographicExtent]
}>()

const wellKnownExtents = getExtents()

let bbox_west_long = ref<number>(0)
let bbox_east_long = ref<number>(0)
let bbox_south_lat = ref<number>(0)
let bbox_north_lat = ref<number>(0)
let selectedWkeSlug = ref<string | undefined>(wellKnownExtents[0].slug)
let renderMaps = ref<boolean>(true)

let wellKnownExtent: ComputedRef<WellKnownExtent | undefined> = computed(() => {
  if (!selectedWkeSlug.value || selectedWkeSlug.value === 'custom') {
    return undefined
  }
  return getExtent(selectedWkeSlug.value)
})

let customExtent: ComputedRef<GeographicExtent> = computed(() => {
  return {
    bounding_box: {
      west_longitude: bbox_west_long.value,
      east_longitude: bbox_east_long.value,
      south_latitude: bbox_south_lat.value,
      north_latitude: bbox_north_lat.value,
    },
  }
})

let extent: ComputedRef<GeographicExtent> = computed(() => {
  if (wellKnownExtent.value) {
    return wellKnownExtent.value.extent.geographic
  }
  return customExtent.value
})

let projection: ComputedRef<ReferenceSystemInfo | undefined> = computed(() => {
  if (!wellKnownExtent.value) return undefined
  return createProjection(getProjection(wellKnownExtent.value.projectionSlug))
})

onMounted(() => {
  emit('update:isoExtentGeographic', extent.value)
})

watch(wellKnownExtent, () => {
  if (wellKnownExtent.value) {
    bbox_west_long.value = wellKnownExtent.value.extent.geographic.bounding_box.west_longitude
    bbox_east_long.value = wellKnownExtent.value.extent.geographic.bounding_box.east_longitude
    bbox_south_lat.value = wellKnownExtent.value.extent.geographic.bounding_box.south_latitude
    bbox_north_lat.value = wellKnownExtent.value.extent.geographic.bounding_box.north_latitude
  }
})

watch(extent, async () => {
  // crude way to update maps when extent changes
  renderMaps.value = false
  await nextTick()
  renderMaps.value = true

  emit('update:isoExtentGeographic', extent.value)
})
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="4.3"
      :stability="Stability.Stable"
      anchor="extent-geographic"
      title="Spatial extent"
      :data-file-href="['extents.json', 'projections.json']"
    />
    <ThreeColumn>
      <template #left>
        <div class="space-y-4">
          <div class="space-y-2">
            <FormLabel v-for="wke in wellKnownExtents" :key="wke.slug">
              <input
                :id="`extent-geo-${wke.slug}`"
                v-model="selectedWkeSlug"
                type="radio"
                name="extents"
                :value="wke.slug"
              />
              {{ wke.name }}
            </FormLabel>
            <FormLabel>
              <input
                id="extent-geo-custom"
                v-model="selectedWkeSlug"
                type="radio"
                name="extents"
                value="custom"
              />
              Custom extent
            </FormLabel>
          </div>
          <div v-if="selectedWkeSlug == 'custom'" class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="space-y-2">
                <FormLabel>West Longitude</FormLabel>
                <FormInput
                  id="bbox-west-long"
                  v-model="bbox_west_long"
                  type="number"
                  name="west-long"
                />
              </div>
              <div class="space-y-2">
                <FormLabel>East Longitude</FormLabel>
                <FormInput
                  id="bbox-east-long"
                  v-model="bbox_east_long"
                  type="number"
                  name="east-long"
                />
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="space-y-2">
                <FormLabel>South Latitude</FormLabel>
                <FormInput
                  id="bbox-south-lat"
                  v-model="bbox_south_lat"
                  type="number"
                  name="south-lat"
                />
              </div>
              <div class="space-y-2">
                <FormLabel>North Latitude</FormLabel>
                <FormInput
                  id="bbox-north-lat"
                  v-model="bbox_north_lat"
                  type="number"
                  name="north-lat"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #middle>
        <div class="space-y-4">
          <div id="extent-geographic" class="space-y-2">
            <p>Extent (Geographic):</p>
            <Output v-if="extent" :data="extent"></Output>
          </div>
          <div v-if="projection" id="spatial-crs" class="space-y-2">
            <p>Projection:</p>
            <Output max-height-class="max-h-16" :data="projection"></Output>
          </div>
        </div>
      </template>
      <template #right>
        <div class="space-y-2">
          <div class="text-sky-500">Preview (2D, EPSG:3857)</div>
          <GeographicExtentMap v-if="renderMaps" :extent="extent" />
        </div>
      </template>
    </ThreeColumn>
  </SectionBorder>
</template>
