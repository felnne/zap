<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { getCollections } from '@/lib/data'
import { createItemCollectionAggregation } from '@/lib/aggregations'
import type { Collection } from '@/types/app'
import type { Aggregation } from '@/types/iso'
import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:collections': [id: Collection[]]
  'update:isoAggregations': [id: Aggregation[]]
}>()

const collections = getCollections()

let selectedSlugs = ref<string[]>([])

let selectedCollections: ComputedRef<Collection[]> = computed(() => {
  return collections.filter((collection) => selectedSlugs.value.includes(collection.slug))
})

let aggregations: ComputedRef<Aggregation[]> = computed(() => {
  return selectedCollections.value.map((collection) => createItemCollectionAggregation(collection))
})

watch(
  () => selectedCollections.value,
  () => {
    emit('update:collections', selectedCollections.value)
    emit('update:isoAggregations', aggregations.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Experimental"
      version="1.0"
      anchor="collections"
      title="Collections"
      :data-file-href="['collections.json']"
    />
    <TwoColumn>
      <template #left>
        <div>
          <FormLabel v-for="collection in collections" :key="collection.slug">
            <input
              :id="'collection-' + collection.slug"
              v-model="selectedSlugs"
              type="checkbox"
              name="collections"
              :value="collection.slug"
            />
            {{ collection.name }}
          </FormLabel>
        </div>
      </template>
      <template #right><Output :data="aggregations"></Output></template>
    </TwoColumn>
  </SectionBorder>
</template>
