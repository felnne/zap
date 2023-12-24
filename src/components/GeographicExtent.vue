<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import ClipboardCopy from './ClipboardCopy.vue'
import SectionTitle from './SectionTitle.vue'

import extentsData from '../data/extents.json'

type GeographicExtent = {
  bounding_box: {
    west_longitude: number
    east_longitude: number
    south_latitude: number
    north_latitude: number
  }
}

type WellKnownExtent = {
  slug: string
  name: string
  extent: {
    geographic: GeographicExtent
  }
}

type Extent = {
  geographic: GeographicExtent
}

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
    <p class="text-xl font-semibold text-gray-500 mb-5">Well-known extents</p>
    <form>
      <label v-for="wke in wellKnownExtents" :key="wke.slug">
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
    <code>
      <pre>{{ extent }}</pre>
    </code>
    <ClipboardCopy :data="extent" />
  </section>
</template>
