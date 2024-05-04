<script setup lang="ts">
import { ValidationStatus } from '@/types/enum'
import { computed, type ComputedRef, type PropType } from 'vue'

import Button from '@/components/bases/Button.vue'

const props = defineProps({
  state: {
    type: String as PropType<ValidationStatus>,
    required: true,
  },
})

let label: ComputedRef<string> = computed(() => {
  if (props.state == ValidationStatus.Empty || props.state == ValidationStatus.Pending) {
    return 'Set'
  }
  if (props.state == ValidationStatus.Validating) {
    return 'Checking...'
  }
  if (props.state == ValidationStatus.Valid) {
    return 'OK'
  }

  return 'ERROR!'
})

let enabled: ComputedRef<boolean> = computed(() => {
  if (props.state == ValidationStatus.Pending) {
    return true
  }

  return false
})
</script>

<template>
  <Button :disabled="!enabled" @click="$emit('button-click')">{{ label }}</Button>
</template>
