<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import { Stability } from '@/types/enum'
import { getExtents, getExtent, getProjection } from '@/utils/data'
import { createExtent, createProjection } from '@/utils/extents'
import type { WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const wellKnownExtents = getExtents()

let selectedWkeSlug = ref<string>(wellKnownExtents[0].slug)

let wellKnownExtent: ComputedRef<WellKnownExtent> = computed(() => {
  return getExtent(selectedWkeSlug.value)
})

let extent: ComputedRef<Extent> = computed(() => {
  return createExtent(wellKnownExtent.value)
})

let projection: ComputedRef<ReferenceSystemInfo> = computed(() => {
  return createProjection(getProjection(wellKnownExtent.value.projectionSlug))
})
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="2.0"
      :stability="Stability.Experimental"
      anchor="spatial-extent"
      title="Spatial extent"
      sub-title="Well-known extents"
    />
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
  </SectionBorder>
</template>
