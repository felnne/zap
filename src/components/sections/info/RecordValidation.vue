<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'
import { type DefinedError } from 'ajv'

import { Stability } from '@/types/enum'
import type { Record as IsoRecord } from '@/types/iso'
import { validateRecordText } from '@/lib/validation'

import FormTextarea from '@/components/bases/FormTextarea.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Button from '@/components/bases/Button.vue'
import Pre from '@/components/bases/Pre.vue'

/*
 * This component has 4 states:
 * 1. Empty (input is blank, initial state)
 * 2. Valid (input is present, can be parsed as JSON and complies with schema)
 * 3. Invalid (input is present, can be parsed as JSON but does not comply with schema)
 * 4. Error (input is present, but cannot be parsed as JSON)
 */
enum State {
  Empty,
  Error,
  Invalid,
  Valid,
}

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
  },
})

let state = ref<State>(State.Empty)
let source = ref<Source>(Source.UserInput)
let errors = ref<DefinedError[]>([])
let input = ref<string>('')

let validityMessage: ComputedRef<String> = computed(() => {
  if (state.value == State.Error) {
    return '😕 Record cannot be understood (invalid format).'
  } else if (state.value == State.Invalid) {
    return '😩 Record is invalid.'
  } else if (state.value == State.Valid) {
    return '😀 Record is valid.'
  } else {
    // State.Empty and catch-all
    return ''
  }
})

let validityClass: ComputedRef<String[]> = computed(() => {
  const negativeClass = ['border-red-500', 'text-red-500']

  if (state.value == State.Error) {
    return negativeClass
  } else if (state.value == State.Invalid) {
    return negativeClass
  } else if (state.value == State.Valid) {
    return ['border-green-500', 'text-green-500']
  } else {
    // State.Empty and catch-all
    return []
  }
})

watch(
  () => input.value,
  () => {
    let result: DefinedError[] = []

    if (input.value.length === 0) {
      state.value = State.Empty
      return
    }

    try {
      result = validateRecordText(input.value)
    } catch {
      state.value = State.Error
      errors.value = []
      return
    }

    if (result.length === 0) {
      state.value = State.Valid
      errors.value = []
    } else {
      state.value = State.Invalid
      errors.value = result
    }
  }
)
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle
      version="2.0"
      :stability="Stability.Experimental"
      anchor="validate"
      title="Record Validation"
      :add-toc="false"
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
      <div class="space-y-2" v-if="source == Source.UserInput">
        <p>Alternatively, paste a record from elsewhere below to validate it.</p>
        <FormTextarea id="validation-input" class="w-full flex-grow" v-model="input"></FormTextarea>
      </div>
      <div id="validation-message" v-if="state != State.Empty" class="border-l-4 border-solid pl-2 text-lg font-semibold" :class="validityClass">
        {{ validityMessage }}
      </div>
      <Pre id="validation-errors" v-if="errors.length > 0">{{ errors }}</Pre>
    </div>
  </SectionBorder>
</template>
@/lib/validation
