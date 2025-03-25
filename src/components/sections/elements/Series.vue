<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { getSeries } from '@/lib/data'
import type { Series } from '@/types/app'
import type { Series as IsoSeries } from '@/types/iso'
import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Button from '@/components/bases/Button.vue'

const props = defineProps({
  edition: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:series': [id: Series | undefined]
  'update:isoSeries': [id: IsoSeries | undefined]
}>()

const clearSelectedSlug = () => {
  selectedSlug.value = undefined
}

const allSeries = getSeries()

let selectedSlug = ref<string | undefined>(undefined)
let sheet = ref<string | undefined>(undefined)

let selectedSeries: ComputedRef<Series | undefined> = computed(() => {
  if (!selectedSlug.value) return undefined
  let series = allSeries.find((s) => s.slug === selectedSlug.value)
  if (series && sheet.value) {
    series = { ...series, sheet: sheet.value }
  }
  return series
})

let isoSeries: ComputedRef<IsoSeries | undefined> = computed(() => {
  if (!selectedSeries.value) return undefined

  const series: IsoSeries = {
    name: selectedSeries.value.name,
    edition: props.edition,
  }
  if (sheet.value) {
    series.sheet = sheet.value
  }

  return series
})

watch(
  () => selectedSeries.value,
  () => {
    emit('update:series', selectedSeries.value)
    emit('update:isoSeries', isoSeries.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="1.3"
      anchor="series"
      title="Series"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#series"
      :data-file-href="['series.json']"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-4">
          <div class="space-y-2">
            <FormLabel v-for="aSeries in allSeries" :key="aSeries.slug">
              <input
                :id="'series-' + aSeries.slug"
                v-model="selectedSlug"
                type="radio"
                name="series"
                :value="aSeries.slug"
              />
              {{ aSeries.name }}
            </FormLabel>
            <Button @click="clearSelectedSlug">Clear</Button>
          </div>
          <div class="space-y-2">
            <FormLabel for="sheet">Sheet number</FormLabel>
            <FormInput
              id="sheet"
              v-model="sheet"
              type="text"
              name="sheet"
              class="w-full"
              disabled
            />
          </div>
        </div>
      </template>
      <template #right>
        <div class="space-y-4">
          <Output :data="isoSeries"></Output>
          <GuidanceText>Sheet number isn't currently supported 😔.</GuidanceText>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
