<script setup lang="ts">
import { UploadStatus } from '@/types/enum'
import { computed, type ComputedRef, type PropType } from 'vue'

import Button from '@/components/bases/Button.vue'

const props = defineProps({
  state: {
    type: String as PropType<UploadStatus>,
    required: true,
  },
})

defineEmits<{
  (event: 'button-click', payload?: Record<string, any[]>): void // eslint-disable-line @typescript-eslint/no-explicit-any
}>()

let label: ComputedRef<string> = computed(() => {
  if (props.state == UploadStatus.Empty || props.state == UploadStatus.Pending) {
    return 'Upload'
  }
  if (props.state == UploadStatus.Uploading) {
    return 'Uploading...'
  }
  if (props.state == UploadStatus.Uploaded) {
    return 'Uploaded'
  }

  return 'ERROR!'
})

let enabled: ComputedRef<boolean> = computed(() => {
  if (props.state == UploadStatus.Pending) {
    return true
  }

  return false
})
</script>

<template>
  <Button :disabled="!enabled" @click="$emit('button-click')">{{ label }}</Button>
</template>
