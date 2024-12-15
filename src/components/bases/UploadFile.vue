<script setup lang="ts">
import { computed, type ComputedRef, ref, watch, watchEffect } from 'vue'

import { UploadStatus } from '@/types/enum'
import type { Format } from '@/types/app'
import { stageFile } from '@/lib/upload'
import { getFormatFile } from '@/lib/distribution'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import ButtonUpload from '@/components/bases/ButtonUpload.vue'

const props = defineProps({
  context: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:format': [id: Format]
  'update:sizeBytes': [id: number]
  'update:url': [id: string]
}>()

const onFileChange = (e: Event) => {
  let files = (e.target as HTMLInputElement).files
  if (files) file.value = files[0]
  state.value = UploadStatus.Pending
}

const clearFile = () => {
  file.value = undefined
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  state.value = UploadStatus.Empty
}

const uploadFile = async () => {
  if (!file.value) return

  try {
    state.value = UploadStatus.Uploading
    let stagedFileUrl = await stageFile(file.value, props.fileIdentifier)
    url.value = stagedFileUrl
    state.value = UploadStatus.Uploaded
  } catch (e: unknown) {
    state.value = UploadStatus.Error
    if (e instanceof Error) {
      if (e.message.includes('error-file-exists')) {
        alert('File already exists. Rename and add again.')
      } else {
        alert(e.message)
      }
    }
  }
}

let state = ref<UploadStatus>(UploadStatus.Empty)
let file = ref<File | undefined>(undefined)
let fileInput = ref<HTMLInputElement | null>(null)
let format = ref<Format | boolean | undefined>(undefined)
let url = ref<string | undefined>(undefined)

watchEffect(async () => {
  if (!file.value) {
    format.value = undefined
    return
  }

  try {
    format.value = await getFormatFile(file.value)
  } catch (e) {
    if (e instanceof Error && e.message === 'Cannot determine format.') {
      alert(`File format for '${file.value.name}' is not supported, rejecting.`)
      // have to return something other than 'null' to cause a change in value,
      // otherwise the watch() won't fire to clear the file input.
      format.value = false
    } else {
      format.value = undefined
    }
  }
})

let sizeBytes: ComputedRef<number | undefined> = computed(() => {
  if (!file.value) return undefined

  return file.value.size
})

watch(format, (value: Format | boolean | undefined) => {
  if (value === false) {
    // if format is unsupported or otherwise invalid, reject file
    clearFile()
  }

  if (value) {
    emit('update:format', value as Format)
  }
})

watch(
  () => sizeBytes.value,
  () => {
    if (sizeBytes.value) {
      emit('update:sizeBytes', sizeBytes.value)
    }
  }
)

watch(
  () => url.value,
  () => {
    if (url.value) {
      emit('update:url', url.value)
    }
  }
)
</script>

<template>
  <div class="flex space-x-4">
    <div class="flex space-x-2">
      <FormLabel class="text-neutral-500">File</FormLabel>
      <input
        :id="context + '-' + identifier + '-file'"
        ref="fileInput"
        class="file:cursor-pointer file:border file:border-black file:bg-white file:px-2 file:py-1 file:text-xs file:shadow file:hover:bg-neutral-100"
        type="file"
        @change="onFileChange"
      />
      <ButtonUpload
        :id="context + '-' + identifier + '-upload'"
        :state="state"
        @click="uploadFile"
      ></ButtonUpload>
    </div>
    <div class="flex flex-grow space-x-2">
      <FormLabel class="text-neutral-500">URL</FormLabel>
      <FormInput
        :id="context + '-' + identifier + '-url'"
        v-model="url"
        type="text"
        :name="context + '-' + identifier + '-url'"
        readonly
      />
    </div>
  </div>
</template>
