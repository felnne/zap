<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { ValidationStatus } from '@/types/enum'
import type { Format } from '@/types/app'
import { statSanPath, encodeSanPath } from '@/lib/upload'
import { getFormatString } from '@/lib/distribution'

import ButtonStat from '@/components/bases/ButtonStat.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'

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
  path.value = ''
  state.value = ValidationStatus.Empty
}

const statPath = async () => {
  if (!path.value) return

  try {
    state.value = ValidationStatus.Validating
    sizeBytes.value = await statSanPath(path.value)
    url.value = encodeSanPath(path.value)
    state.value = ValidationStatus.Valid
  } catch (e: any) {
    state.value = ValidationStatus.Error
    if (e instanceof Error) {
      if (e.message.includes('error-path-not-found')) {
        state.value = ValidationStatus.Invalid
        alert('SAN file could not be accessed. Check path and/or permissions.')
      } else {
        alert(e.message)
      }
    }
  }
}

let state = ref<ValidationStatus>(ValidationStatus.Empty)
let path = ref<string | undefined>(undefined)
let sizeBytes = ref<number | undefined>(undefined)
let url = ref<string | undefined>(undefined)

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

watch(
  () => path.value,
  () => {
    if (!path.value) {
      state.value = ValidationStatus.Empty
    }

    state.value = ValidationStatus.Pending
  }
)

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
  <div class="space-y-4">
    <div class="flex space-x-4">
      <div class="flex flex-grow space-x-2">
        <FormLabel class="text-neutral-500">SAN Path</FormLabel>
        <FormInput
          type="text"
          :name="'download-' + index + '-path'"
          :id="'download-' + index + '-path'"
          v-model="path"
        />
        <ButtonStat
          :id="'download-' + index + '-stat'"
          @button-click="statPath"
          :state="state"
        ></ButtonStat>
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
    <GuidanceText
      >Paths from the U drive on Windows (e.g. <code>U:/magic/.../map.png</code>) will not work
      here. They should start with <code>/data/...</code> or similar.
    </GuidanceText>
  </div>
</template>
