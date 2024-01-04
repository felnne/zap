<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

import type { WellKnownExtent } from '@/types/app'
import type { Extent } from '@/types/iso'

import extentsData from '@/data/extents.json'

function createExtent(wke: WellKnownExtent): Extent {
  return {
    geographic: wke.extent.geographic
  }
}

const wellKnownExtents: Record<string, WellKnownExtent> = Object.values(
  extentsData.geographic
).reduce((acc: Record<string, WellKnownExtent>, wke: WellKnownExtent) => {
  acc[wke.slug] = {
    slug: wke.slug,
    name: wke.name,
    extent: {
      geographic: wke.extent.geographic
    }
  }
  return acc
}, {})

let selectedWkeSlug = ref<string>(Object.keys(wellKnownExtents)[0])

let extent: ComputedRef<Extent> = computed(() => {
  return createExtent(wellKnownExtents[selectedWkeSlug.value])
})
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="spatial-extent" title="Spatial extent" sub-title="Well-known extents" />
    <TwoColumn>
      <template v-slot:left>
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
      </template>
      <template v-slot:right>
        <Output :data="extent"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
