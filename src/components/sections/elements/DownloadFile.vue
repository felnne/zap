<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { UploadStatus } from '@/types/enum'
import type { Format } from '@/types/app'
import { stageFile } from '@/lib/upload'
import { getFileFormat } from '@/lib/distribution'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import ButtonUpload from '@/components/bases/ButtonUpload.vue'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:format': [id: Format]
  'update:url': [id: string]
}>()

const onFileChange = (e: Event) => {
  let files = (e.target as HTMLInputElement).files
  if (files) file.value = files[0]
  state.value = UploadStatus.Pending
}

const clearFile = () => {
  file.value = null
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
  } catch (e: any) {
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
let file = ref<File | null>(null)
let fileInput = ref<HTMLInputElement | null>(null)
let url = ref<string>('')

let format: ComputedRef<Format | boolean | null> = computed(() => {
  if (!file.value) return null

  try {
    return getFileFormat(file.value)
  } catch (e) {
    if (e instanceof Error && e.message == 'Cannot determine format.') {
      alert(`File format for '${file.value.name}' is not supported, rejecting.`)
      // have to return something other than 'null' to cause a change in value,
      // otherwise the watch() won't fire to clear the file input.
      return false
    }
  }

  return null
})

watch(format, (value: Format | boolean | null) => {
  if (value === false) {
    // if format is unsupported or otherwise invalid, reject file
    clearFile()
  }

  // cast value to Format as only null on init which won't trigger watch
  emit('update:format', value as Format)
})

watch(
  () => url.value,
  () => {
    emit('update:url', url.value)
  }
)
</script>

<template>
  <div class="flex space-x-4">
    <div class="flex space-x-2">
      <FormLabel class="text-neutral-500">File</FormLabel>
      <input
        ref="fileInput"
        class="file:cursor-pointer file:border file:border-black file:bg-white file:px-2 file:py-1 file:text-xs file:shadow file:hover:bg-neutral-100"
        type="file"
        :id="'download-' + index + '-file'"
        @change="onFileChange"
      />
      <ButtonUpload
        :id="'download-' + index + '-upload'"
        @click="uploadFile"
        :state="state"
      ></ButtonUpload>
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
