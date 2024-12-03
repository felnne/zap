<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { getImpreciseDate } from '@/lib/dates'
import type { DateImpreciseLabelled } from '@/types/app'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  showTime: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits<{
  'add:date': [id: DateImpreciseLabelled]
  'remove:date': [id: DateImpreciseLabelled]
}>()

const create = () => {
  emit('add:date', date.value)
}

const remove = () => {
  emit('remove:date', date.value)
}

const now = new Date()

let selected = ref<boolean>(false)
const year = ref<number>(now.getFullYear())
const month = ref<number>(now.getMonth() + 1)
const day = ref<number>(now.getDate())
const hour = ref<number>(now.getUTCHours())
const minute = ref<number>(now.getUTCMinutes())
const second = ref<number>(now.getUTCSeconds())

let selectionClasses: ComputedRef<string[]> = computed(() => {
  let classes = ['h-6']
  if (props.required) {
    classes.push('cursor-not-allowed')
  }
  return classes
})

let yearDisabled: ComputedRef<boolean> = computed(() => {
  return !selected.value
})

let monthDisabled: ComputedRef<boolean> = computed(() => {
  return yearDisabled.value || year.value == 0
})

let dayDisabled: ComputedRef<boolean> = computed(() => {
  return monthDisabled.value || month.value == 0
})

let hourDisabled: ComputedRef<boolean> = computed(() => {
  return dayDisabled.value || day.value == 0
})

let minuteDisabled: ComputedRef<boolean> = computed(() => {
  return hourDisabled.value || hour.value == 0
})

let secondDisabled: ComputedRef<boolean> = computed(() => {
  return minuteDisabled.value || minute.value == 0
})

let monthIndex: ComputedRef<number> = computed(() => {
  return month.value - 1
})

let date: ComputedRef<DateImpreciseLabelled> = computed(() => {
  return {
    label: props.label,
    date: getImpreciseDate(
      year.value,
      monthIndex.value,
      day.value != 0 ? day.value : -1,
      hour.value != 0 ? hour.value : -1,
      minute.value != 0 ? minute.value : -1,
      second.value != 0 ? second.value : -1
    ),
  }
})

onMounted(() => {
  if (props.required) {
    selected.value = true
  }
  if (!props.showTime) {
    hour.value = 0
    minute.value = 0
    second.value = 0
  }
})

watch(selected, (value) => {
  if (value) {
    create()
  } else {
    remove()
  }
})

watch(date, () => {
  if (selected.value) {
    // update date value by recreating it
    // (this isn't very efficient)
    remove()
    create()
  }
})
</script>

<template>
  <fieldset class="grid grid-cols-8 gap-4">
    <FormLabel class="col-span-2 flex items-end space-x-2">
      <input
        :id="`date-${label}-selection`"
        v-model="selected"
        :class="selectionClasses"
        type="checkbox"
        name="dates"
        :disabled="required"
      />
      <span>{{ label }}</span>
      <span v-if="required">(<em>required</em>)</span>
    </FormLabel>
    <div class="space-y-2">
      <FormLabel for="date-year" class="block">Year</FormLabel>
      <FormInput
        id="date-year"
        v-model="year"
        class="w-16"
        type="number"
        name="date"
        :disabled="yearDisabled"
      />
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
        :disabled="monthDisabled"
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
        :disabled="dayDisabled"
      />
    </div>
    <template v-if="showTime">
      <div class="space-y-2">
        <FormLabel for="date-hour" class="block">Hour</FormLabel>
        <FormInput
          id="date-hour"
          v-model="hour"
          class="w-14"
          type="number"
          min="0"
          max="23"
          name="date"
          :disabled="hourDisabled"
        />
      </div>
      <div class="space-y-2">
        <FormLabel for="date-minute" class="block">Min.</FormLabel>
        <FormInput
          id="date-minute"
          v-model="minute"
          class="w-14"
          type="number"
          min="0"
          max="59"
          name="date"
          :disabled="minuteDisabled"
        />
      </div>
      <div class="space-y-2">
        <FormLabel for="date-second" class="block">Sec.</FormLabel>
        <FormInput
          id="date-second"
          v-model="second"
          class="w-14"
          type="number"
          min="0"
          max="59"
          name="date"
          :disabled="secondDisabled"
        />
      </div>
    </template>
  </fieldset>
</template>
