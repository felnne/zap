<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'

import type { DropdownItem, Thumbnail as ThumbnailT } from '@/types/app'
import type { GraphicOverview } from '@/types/iso'
import { getThumbnails } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import SectionLabel from '@/components/bases/SectionLabel.vue'
import Button from '@/components/bases/Button.vue'
import Output from '@/components/bases/Output.vue'
import Thumbnail from '@/components/sections/elements/Thumbnail.vue'

defineProps({
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:isoGraphicOverviews': [id: GraphicOverview[]]
}>()

const dependantSections: DropdownItem[] = [{ href: '#file-identifier', title: 'File Identifier' }]

const thumbnailTypes = getThumbnails()

let selectedThumbnails = ref<ThumbnailT[]>([])
let graphicOverviews = ref<Record<string, GraphicOverview>>({})

let graphicOverviewsCount: ComputedRef<number> = computed(() => {
  return Object.keys(graphicOverviews.value).length
})

watch(
  () => graphicOverviews,
  () => {
    emit('update:isoGraphicOverviews', Object.values(graphicOverviews.value))
  },
  { deep: true }
)
</script>
<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="1.0"
      :stability="Stability.Experimental"
      anchor="thumbnails"
      title="Thumbnails"
      :data-file-href="['formats.json', 'thumbnails.json']"
      :depends-on="dependantSections"
    />
    <div class="space-y-4">
      <Thumbnail
        v-for="thumbnail in selectedThumbnails"
        :key="thumbnail.slug"
        :identifier="thumbnail.identifier"
        :description="thumbnail.description"
        :file-identifier="fileIdentifier"
        @update:iso-graphic-overview="
          (event: GraphicOverview) => (graphicOverviews[thumbnail.slug] = event)
        "
      ></Thumbnail>
      <div class="flex items-center space-x-2">
        <Button
          v-for="thumbnail in thumbnailTypes"
          :id="'add-thumbnail-' + thumbnail.slug"
          :key="thumbnail.slug"
          :disabled="selectedThumbnails.includes(thumbnail)"
          @click="selectedThumbnails.push(thumbnail)"
        >
          Add {{ thumbnail.identifier }}
        </Button>
      </div>
      <div v-if="graphicOverviewsCount > 0" class="space-y-4">
        <SectionLabel text-colour-class="text-sky-500">Preview</SectionLabel>
        <div class="flex items-center space-x-2 border border-sky-500 p-2">
          <figure
            v-for="graphicOverview in Object.values(graphicOverviews)"
            :key="graphicOverview.identifier"
          >
            <img :src="graphicOverview.href" :alt="graphicOverview.description" />
            <figcaption>{{ graphicOverview.identifier }}</figcaption>
          </figure>
        </div>
      </div>
      <Output v-if="graphicOverviewsCount > 0" :data="Object.values(graphicOverviews)" />
    </div>
  </SectionBorder>
</template>
