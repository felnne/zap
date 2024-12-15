<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType } from '@/types/enum'
import type { DistributionOptionIndexed, Licence, Upload as UploadT } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'
import Upload from '@/components/bases/Upload.vue'
import Button from '@/components/bases/Button.vue'

const props = defineProps({
  index: {
    type: String,
    required: true,
  },
  fileIdentifier: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
  licence: {
    type: Object as PropType<Licence>,
    required: true,
  },
})

const emit = defineEmits<{
  destroy: [id: string]
  'update:distributionOptionIndexed': [id: DistributionOptionIndexed]
}>()

const destroy = () => {
  emit('destroy', props.index)
}

let upload = ref<UploadT | undefined>(undefined)

let distributor: ComputedRef<IsoContact> = computed(() =>
  createDistributor(props.resourceType, props.licence)
)

let distributionOption: ComputedRef<DistributionOption | undefined> = computed(() => {
  if (!upload.value || !upload.value.format) return undefined

  return createDownloadDistributionOption(
    upload.value.format,
    upload.value.url ? upload.value.url : '',
    distributor.value,
    upload.value.sizeBytes
  )
})

let distributionOptionIndexed: ComputedRef<DistributionOptionIndexed> = computed(() => {
  return {
    index: props.index,
    distributionOption: distributionOption.value,
  }
})

watch(
  () => upload.value,
  () => {
    if (distributionOption.value) {
      emit('update:distributionOptionIndexed', distributionOptionIndexed.value)
    }
  }
)
</script>

<template>
  <SubSectionBorder :id="'download-' + index" class="flex space-x-4">
    <Upload
      :context="'download'"
      :identifier="index"
      :file-identifier="fileIdentifier"
      @update:upload="(event: UploadT) => (upload = event)"
    ></Upload>
    <Button :id="'download-' + index + '-destroy'" @click="destroy()">✖️</Button>
  </SubSectionBorder>
</template>
