<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType } from '@/types/enum'
import type { Licence, Upload as UploadT } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import Output from '@/components/bases/Output.vue'
import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'
import Upload from '@/components/bases/Upload.vue'

const props = defineProps({
  index: {
    type: Number,
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
  'update:isoDistributionOption': [id: DistributionOption]
}>()

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

watch(
  () => upload.value,
  () => {
    // a download is only useful when there's a URL, which is sensitive to / embeds the format so doesn't need watching
    if (distributionOption.value) {
      emit('update:isoDistributionOption', distributionOption.value)
    }
  }
)
</script>

<template>
  <SubSectionBorder :id="'download-' + index" class="space-y-2">
    <Upload
      :context="'download'"
      :identifier="index"
      :file-identifier="fileIdentifier"
      @update:upload="(event: UploadT) => (upload = event)"
    ></Upload>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
