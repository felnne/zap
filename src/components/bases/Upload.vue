<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { UploadSource } from '@/types/enum'
import type { Format, Upload } from '@/types/app'

import UploadFile from '@/components/bases/UploadFile.vue'
import UploadSan from '@/components/bases/UploadSan.vue'
import UploadSwitcher from '@/components/bases/UploadSwitcher.vue'

defineProps({
  context: {
    type: String,
    required: true,
  },
  identifier: {
    type: [Number, String],
    required: true,
  },
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:upload': [id: Upload]
}>()

let source = ref<UploadSource | undefined>(undefined)
let format = ref<Format | undefined>(undefined)
let sizeBytes = ref<number | undefined>(undefined)
let url = ref<string | undefined>(undefined)

let upload: ComputedRef<Upload | undefined> = computed(() => {
  if (!source.value || !format.value || !sizeBytes.value) return undefined
  const url_ = url.value ? url.value : ''

  return {
    source: source.value,
    format: format.value,
    sizeBytes: sizeBytes.value,
    url: url_,
  }
})

watch(
  () => format.value,
  () => {
    if (upload.value) {
      emit('update:upload', upload.value)
    }
  }
)
</script>

<template>
  <template v-if="source === UploadSource.File">
    <UploadFile
      :context="context"
      :identifier="identifier"
      :file-identifier="fileIdentifier"
      @update:format="(event: Format) => (format = event)"
      @update:size-bytes="(event: number) => (sizeBytes = event)"
      @update:url="(event: string) => (url = event)"
    ></UploadFile>
  </template>
  <template v-else-if="source === UploadSource.San">
    <UploadSan
      :context="context"
      :identifier="identifier"
      @update:format="(event: Format) => (format = event)"
      @update:size-bytes="(event: number) => (sizeBytes = event)"
      @update:url="(event: string) => (url = event)"
    ></UploadSan>
  </template>
  <template v-else>
    <p>
      <UploadSwitcher @update:source="(event: UploadSource) => (source = event)"></UploadSwitcher>
    </p>
  </template>
</template>
