<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

import type { WellKnownExtent } from '../types/app'
import type { Extent } from '../types/iso'

import extentsData from '../data/extents.json'

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
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="spatial-extent" title="Spatial extent" />
    <p class="text-xl font-semibold text-gray-500 dark:text-gray-200 mb-5">Well-known extents</p>
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <label v-for="wke in wellKnownExtents" :key="wke.slug" class="text-black dark:text-white">
          <input
            type="radio"
            name="licences"
            :id="'licence-' + wke.slug"
            :value="wke.slug"
            v-model="selectedWkeSlug"
          />
          {{ wke.name }}
        </label>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="extent"></Output>
      </div>
    </div>
  </section>
</template>
