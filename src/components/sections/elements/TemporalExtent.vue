<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import type { DateImpreciseLabelled } from '@/types/app'
import type { TemporalExtent } from '@/types/iso'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import Date from '@/components/bases/Date.vue'

const emit = defineEmits<{
  'update:isoExtentTemporal': [id: TemporalExtent | undefined]
}>()

const start = ref<DateImpreciseLabelled | undefined>(undefined)
const end = ref<DateImpreciseLabelled | undefined>(undefined)

let extent: ComputedRef<TemporalExtent | undefined> = computed(() => {
  if (start.value && end.value) {
    return { period: { start: start.value.date.iso, end: end.value.date.iso } }
  } else if (start.value && !end.value) {
    return { period: { start: start.value.date.iso } }
  } else {
    return undefined
  }
})

watch(
  () => extent.value,
  () => {
    emit('update:isoExtentTemporal', extent.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="1.1"
      anchor="extent-temporal"
      title="Temporal extent"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#temporal-extent"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-4">
          <Date
            label="start"
            @add:date="(event: DateImpreciseLabelled) => (start = event)"
            @remove:date="(event: DateImpreciseLabelled) => (start = undefined)"
          ></Date>
          <Date
            label="end"
            :disabled="!start"
            @add:date="(event: DateImpreciseLabelled) => (end = event)"
            @remove:date="(event: DateImpreciseLabelled) => (end = undefined)"
          ></Date>
          <GuidanceText>If a value is unknown, use 0. Year is required.</GuidanceText>
        </div>
      </template>
      <template #right>
        <div class="space-y-4">
          <Output id="extent-temporal" :data="extent"></Output>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
