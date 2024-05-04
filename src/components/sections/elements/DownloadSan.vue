<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { ValidationStatus } from '@/types/enum'
import type { Format } from '@/types/app'
import { encodeSanPath } from '@/lib/upload'
import { getFormatString } from '@/lib/distribution'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'

defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits<{
  'update:format': [id: Format]
  'update:sizeBytes': [id: number]
  'update:url': [id: string]
}>()

const clearPath = () => {
  path.value = undefined
  state.value = ValidationStatus.Empty
}

let state = ref<ValidationStatus>(ValidationStatus.Empty)
let path = ref<string | undefined>(undefined)

let url: ComputedRef<string | undefined> = computed(() => {
  if (!path.value) return undefined

  return encodeSanPath(path.value)
})

let format: ComputedRef<Format | boolean | undefined> = computed(() => {
  if (!path.value) return undefined

  try {
    return getFormatString(path.value)
  } catch (e) {
    if (e instanceof Error && e.message == 'Cannot determine format.') {
      alert(`File format for '${path.value}' is not supported, rejecting.`)
      // have to return something other than 'null' to cause a change in value,
      // otherwise the watch() won't fire to clear the file input.
      return false
    }
  }

  return undefined
})

let sizeBytes: ComputedRef<number | undefined> = computed(() => {
  if (!path.value) return undefined

  return 0
})

watch(format, (value: Format | boolean | undefined) => {
  if (value === false) {
    // if format is unsupported or otherwise invalid, reject path
    clearPath()
  }

  if (value) {
    emit('update:format', value as Format)
  }
})

watch(
  () => sizeBytes.value,
  () => {
    if (sizeBytes.value !== undefined) {
      emit('update:sizeBytes', sizeBytes.value)
    }
  }
)

watch(
  () => url.value,
  () => {
    if (url.value) {
      state.value = ValidationStatus.Valid
      emit('update:url', url.value)
    }
  }
)
</script>

<template>
  <div class="flex space-x-4">
    <div class="flex flex-grow space-x-2">
      <FormLabel class="text-neutral-500">SAN Path</FormLabel>
      <FormInput
        type="text"
        name="'download-' + index + '-path'"
        :id="'download-' + index + '-path'"
        v-model="path"
      />
    </div>
    <div class="flex flex-grow space-x-2">
      <FormLabel class="text-neutral-500">URL</FormLabel>
      <FormInput
        type="text"
        name="'download-' + index + '-url'"
        :id="'download-' + index + '-url'"
        readonly
        v-model="url"
      />
    </div>
  </div>
</template>
