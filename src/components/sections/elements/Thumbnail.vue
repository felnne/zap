<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { UploadAccess } from '@/types/enum'
import type { Upload as UploadT } from '@/types/app'
import type { GraphicOverview } from '@/types/iso'

import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'
import Upload from '@/components/bases/Upload.vue'
import Button from '@/components/bases/Button.vue'

const props = defineProps({
  identifier: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  destroy: [id: void]
  'update:isoGraphicOverview': [id: GraphicOverview]
}>()

const destroy = () => {
  emit('destroy')
}

let upload = ref<UploadT | undefined>(undefined)

let graphicOverview: ComputedRef<GraphicOverview | undefined> = computed(() => {
  if (
    !upload.value ||
    !upload.value.format ||
    !upload.value.format.mediaTypes ||
    !upload.value.format.mediaTypes[0] ||
    upload.value.url === ''
  )
    return undefined

  return {
    identifier: props.identifier,
    description: props.description,
    href: upload.value.url,
    mime_type: upload.value.format.mediaTypes[0],
  }
})

watch(
  () => upload.value,
  () => {
    // a thumbnail is only useful when there's a URL, which is sensitive to / embeds the format so doesn't need watching
    if (graphicOverview.value) {
      emit('update:isoGraphicOverview', graphicOverview.value)
    }
  }
)
</script>

<template>
  <SubSectionBorder :id="'thumbnail-' + identifier" class="flex space-x-4">
    <Upload
      :context="'thumbnail'"
      :identifier="identifier"
      :file-identifier="fileIdentifier"
      :access="UploadAccess.External"
      @update:upload="(event: UploadT) => (upload = event)"
    ></Upload>
    <Button :id="'thumbnail-' + identifier + '-destroy'" @click="destroy()">✖️</Button>
  </SubSectionBorder>
</template>
