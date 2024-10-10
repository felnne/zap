<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { getImpreciseDate } from '@/lib/dates'
import type { DateImpreciseLabelled } from '@/types/app'
import type { Dates as DatesIso } from '@/types/iso'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:dates': [id: DateImpreciseLabelled[]]
  'update:isoDates': [id: DatesIso]
}>()

const label = 'publication'
const now = new Date()

const year = ref<number>(now.getFullYear())
const month = ref<number>(now.getMonth() + 1)
const day = ref<number>(now.getDate())

let monthIndex: ComputedRef<number> = computed(() => {
  return month.value - 1
})

let date: ComputedRef<DateImpreciseLabelled> = computed(() => {
  return {
    label,
    date: getImpreciseDate(year.value, monthIndex.value, day.value != 0 ? day.value : -1),
  }
})

let dates: ComputedRef<DateImpreciseLabelled[]> = computed(() => {
  return [date.value]
})

let datesIso: ComputedRef<DatesIso> = computed(() => {
  return {
    [date.value.label]: date.value.date.iso,
  }
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
  <SectionBorder>
    <SectionTitle version="1.2" anchor="dates" title="Dates" sub-title="Publication date" />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <fieldset class="flex space-x-4">
            <div class="space-y-2">
              <FormLabel for="date-year" class="block">Year</FormLabel>
              <FormInput id="date-year" v-model="year" class="w-16" type="number" name="date" />
            </div>
            <div class="space-y-2">
              <FormLabel for="date-month" class="block">Month</FormLabel>
              <FormInput
                id="date-month"
                v-model="month"
                class="w-14"
                type="number"
                min="0"
                max="12"
                name="date"
              />
            </div>
            <div class="space-y-2">
              <FormLabel for="date-day" class="block">Day</FormLabel>
              <FormInput
                id="date-day"
                v-model="day"
                class="w-14"
                type="number"
                min="0"
                max="31"
                name="date"
              />
            </div>
          </fieldset>
          <GuidanceText>If month or day are unknown, use 0. Year is required.</GuidanceText>
        </div>
      </template>
      <template #right>
        <Output :data="datesIso"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
@/lib/dates
