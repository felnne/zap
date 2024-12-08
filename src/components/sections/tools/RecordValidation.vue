<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'
import { type DefinedError } from 'ajv'

import { Stability, ValidationStatus, SectionType } from '@/types/enum'
import type { Record as IsoRecord } from '@/types/iso'
import { validateRecordText } from '@/lib/validation'
import { emptyIsoRecord } from '@/lib/record'

import FormTextarea from '@/components/bases/FormTextarea.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Button from '@/components/bases/Button.vue'
import Pre from '@/components/bases/Pre.vue'

/*
 * This component has 2 sources:
 * 1. Current Record (record from prop)
 * 2. Input (user input)
 */
enum Source {
  CurrentRecord,
  UserInput,
}

const useCurrentRecord = () => {
  if (props.currentRecord == null) {
    return
  }
  source.value = Source.CurrentRecord
  input.value = JSON.stringify(props.currentRecord, null, 2)
}

const props = defineProps({
  currentRecord: {
    type: Object as () => IsoRecord,
    required: false,
    default: emptyIsoRecord,
  },
})

let state = ref<ValidationStatus>(ValidationStatus.Empty)
let source = ref<Source>(Source.UserInput)
let errors = ref<DefinedError[]>([])
let input = ref<string>('')

let validityMessage: ComputedRef<string> = computed(() => {
  if (state.value == ValidationStatus.Error) {
    return '😕 Record cannot be understood (invalid format).'
  } else if (state.value == ValidationStatus.Invalid) {
    return '😩 Record is invalid.'
  } else if (state.value == ValidationStatus.Valid) {
    return '😀 Record is valid.'
  } else {
    // ValidationStatus.Empty and catch-all
    return ''
  }
})

let validityClass: ComputedRef<string[]> = computed(() => {
  const negativeClass = ['border-red-500', 'text-red-500']

  if (state.value == ValidationStatus.Error) {
    return negativeClass
  } else if (state.value == ValidationStatus.Invalid) {
    return negativeClass
  } else if (state.value == ValidationStatus.Valid) {
    return ['border-green-500', 'text-green-500']
  } else {
    // ValidationStatus.Empty and catch-all
    return []
  }
})

watch(
  () => input.value,
  () => {
    let result: DefinedError[] = []

    if (input.value.length === 0) {
      state.value = ValidationStatus.Empty
      return
    }

    state.value = ValidationStatus.Pending

    try {
      state.value = ValidationStatus.Validating
      result = validateRecordText(input.value)
    } catch {
      state.value = ValidationStatus.Error
      errors.value = []
      return
    }

    if (result.length === 0) {
      state.value = ValidationStatus.Valid
      errors.value = []
    } else {
      state.value = ValidationStatus.Invalid
      errors.value = result
    }
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Tools">
    <SectionTitle
      :type="SectionType.Tools"
      version="2.1"
      :stability="Stability.Stable"
      anchor="validate"
      title="Record Validation"
      :add-toc="true"
    />
    <div class="space-y-4">
      <div class="space-y-2">
        <p>Click the button below to validate the current record</p>
        <div class="flex items-center space-x-2">
          <Button id="validation-use-current" @click="useCurrentRecord"
            >Validate Current Record</Button
          >
          <GuidanceText
            >Current values for each section will be validated. If values change click the button
            again to revalidate.</GuidanceText
          >
        </div>
      </div>
      <div v-if="source == Source.UserInput" class="space-y-2">
        <p>Alternatively, paste a record from elsewhere below to validate it.</p>
        <FormTextarea id="validation-input" v-model="input" class="w-full flex-grow"></FormTextarea>
      </div>
      <div
        v-if="state != ValidationStatus.Empty"
        id="validation-message"
        class="border-l-4 border-solid pl-2 text-lg font-semibold"
        :class="validityClass"
      >
        {{ validityMessage }}
      </div>
      <Pre v-if="errors.length > 0" id="validation-errors">{{ errors }}</Pre>
    </div>
  </SectionBorder>
</template>
@/lib/validation
