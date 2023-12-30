<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import type { DateImprecise } from '../types/app'
import type { Dates as DatesIso } from '../types/iso'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Output from '../components/Output.vue'
import GuidanceText from '../components/GuidanceText.vue'
import FormLabel from '../components/FormLabel.vue'
import FormInput from '../components/FormInput.vue'
import TwoColumn from '../components/TwoColumn.vue'

const emit = defineEmits(['update:dates'])

const getIsodate = (date: DateImprecise) => {
  const month = String(date.value.getMonth() + 1).padStart(2, '0')
  const day = String(date.value.getDate()).padStart(2, '0')

  let value = `${date.value.getFullYear()}`
  if (date.precision === 'month') {
    value = `${value}-${month}`
  }
  if (date.precision === 'day') {
    value = `${value}-${month}-${day}`
  }

  return value
}

const label = 'published'
const now = new Date()

const year = ref<number>(now.getFullYear())
const month = ref<number>(now.getMonth() + 1)
const day = ref<number>(now.getDate())

let date: ComputedRef<DateImprecise> = computed(() => {
  const value = new Date(year.value, 1, 1)
  let precision = 'year'

  if (month.value) {
    value.setMonth(month.value - 1)
    precision = 'month'
  }
  if (day.value) {
    value.setDate(day.value)
    precision = 'day'
  }

  return { label: label, value: value, precision: precision }
})

let dates: ComputedRef<DateImprecise[]> = computed(() => {
  return [date.value]
})

let datesIso: ComputedRef<DatesIso> = computed(() => {
  return {
    [label]: getIsodate(date.value)
  }
})

onMounted(() => {
  emit('update:dates', dates.value)
})

watch(
  () => dates.value,
  () => {
    emit('update:dates', dates.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="dates" title="Dates" sub-title="Publication date" />
    <TwoColumn>
      <template v-slot:left>
        <div class="space-y-2">
          <fieldset class="flex space-x-4">
            <div class="space-y-2">
              <FormLabel for="date-year" class="block">Year</FormLabel>
              <FormInput class="w-16" type="number" name="date" id="date-year" v-model="year" />
            </div>
            <div class="space-y-2">
              <FormLabel for="date-month" class="block">Month</FormLabel>
              <FormInput
                class="w-14"
                type="number"
                min="0"
                max="12"
                name="date"
                id="date-month"
                v-model="month"
              />
            </div>
            <div class="space-y-2">
              <FormLabel for="date-day" class="block">Day</FormLabel>
              <FormInput
                class="w-14"
                type="number"
                min="0"
                max="31"
                name="date"
                id="date-day"
                v-model="day"
              />
            </div>
          </fieldset>
          <GuidanceText>If month or day are unknown, use 0. Year is required.</GuidanceText>
        </div>
      </template>
      <template v-slot:right>
        <Output :data="datesIso"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
