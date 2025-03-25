<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import type { DateImpreciseLabelled } from '@/types/app'
import type { Dates as DatesIso } from '@/types/iso'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import Date from '@/components/bases/Date.vue'

const emit = defineEmits<{
  'update:dates': [id: DateImpreciseLabelled[]]
  'update:isoDates': [id: DatesIso]
}>()

const addDate = (date: DateImpreciseLabelled) => {
  dates.value = [...dates.value, date]
}

const removeDate = (date: DateImpreciseLabelled) => {
  dates.value = dates.value.filter((d) => d.label !== date.label)
}

const dates = ref<DateImpreciseLabelled[]>([])

let datesIso: ComputedRef<DatesIso> = computed(() => {
  let isoDates: DatesIso = {}
  dates.value.forEach((date) => {
    isoDates[date.label] = date.date.iso
  })
  return isoDates
})

onMounted(() => {
  emit('update:dates', dates.value)
  emit('update:isoDates', datesIso.value)
})

watch(
  () => dates.value,
  () => {
    emit('update:dates', dates.value)
    emit('update:isoDates', datesIso.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="2.3"
      anchor="dates"
      title="Dates"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#dates"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-4">
          <Date
            label="creation"
            :required="true"
            @add:date="(event: DateImpreciseLabelled) => addDate(event)"
          ></Date>
          <Date
            label="revision"
            @add:date="(event: DateImpreciseLabelled) => addDate(event)"
            @remove:date="(event: DateImpreciseLabelled) => removeDate(event)"
          ></Date>
          <Date
            label="publication"
            :show-time="true"
            @add:date="(event: DateImpreciseLabelled) => addDate(event)"
            @remove:date="(event: DateImpreciseLabelled) => removeDate(event)"
          ></Date>
          <Date
            label="released"
            :show-time="true"
            @add:date="(event: DateImpreciseLabelled) => addDate(event)"
            @remove:date="(event: DateImpreciseLabelled) => removeDate(event)"
          ></Date>
        </div>
      </template>
      <template #right>
        <div class="space-y-2">
          <Output :data="datesIso"></Output>
          <GuidanceText>Publication/released values can be in the future.</GuidanceText>
          <GuidanceText>If a value is unknown, use 0. Year is required.</GuidanceText>
          <GuidanceText>Times must be entered as UTC (GMT).</GuidanceText>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
