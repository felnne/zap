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

const useCurrentRecord = () => {
  if (props.currentRecord == null) {
    return
  }
  input.value = JSON.stringify(props.currentRecord, null, 2)
}

const props = defineProps({
  currentRecord: {
    type: Object as () => IsoRecord,
    required: false,
  },
})

let state = ref<State>(State.Empty)
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
  const negativeClass = ['text-red-500']

  if (state.value == State.Error) {
    return negativeClass
  } else if (state.value == State.Invalid) {
    return negativeClass
  } else if (state.value == State.Valid) {
    return ['text-green-500']
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
    <div class="space-y-2">
      <p>
        Paste a record below to validate it. Alternatively, click the button below to validate the
        current record.
      </p>
      <div class="flex items-center space-x-2">
        <Button id="validation-use-current" @click="useCurrentRecord"
          >Validate Current Record</Button
        >
        <GuidanceText>
          Click to copy values from the sections above into the input below. If these values change
          you will need to click the button again.
        </GuidanceText>
      </div>
      <FormTextarea id="validation-input" class="w-full flex-grow" v-model="input"></FormTextarea>
      <div id="validation-message" v-if="state != State.Empty" :class="validityClass">
        {{ validityMessage }}
      </div>
      <Pre id="validation-errors" v-if="errors.length > 0">{{ errors }}</Pre>
    </div>
  </SectionBorder>
</template>
@/lib/validation
