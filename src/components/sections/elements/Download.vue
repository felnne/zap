<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType, DownloadType } from '@/types/enum'
import type { Format, Licence } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import Output from '@/components/bases/Output.vue'
import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'
import DownloadFile from '@/components/sections/elements/DownloadFile.vue'
import DownloadSan from '@/components/sections/elements/DownloadSan.vue'
import DownloadSwitcher from '@/components/sections/elements/DownloadSwitcher.vue'

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

let type = ref<DownloadType | undefined>(undefined)
let format = ref<Format | undefined>(undefined)
let sizeBytes = ref<number | undefined>(undefined)
let url = ref<string | undefined>(undefined)

let distributor: ComputedRef<IsoContact> = computed(() =>
  createDistributor(props.resourceType, props.licence)
)

let distributionOption: ComputedRef<DistributionOption | undefined> = computed(() => {
  if (!format.value) return undefined
  return createDownloadDistributionOption(
    format.value,
    url.value ? url.value : '',
    distributor.value,
    sizeBytes.value
  )
})

watch(
  () => url.value,
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
    <template v-if="type === DownloadType.File">
      <DownloadFile
        :index="index"
        :file-identifier="fileIdentifier"
        @update:format="(event: Format) => (format = event)"
        @update:size-bytes="(event: number) => (sizeBytes = event)"
        @update:url="(event: string) => (url = event)"
      ></DownloadFile>
    </template>
    <template v-else-if="type === DownloadType.San">
      <DownloadSan
        :index="index"
        @update:format="(event: Format) => (format = event)"
        @update:size-bytes="(event: number) => (sizeBytes = event)"
        @update:url="(event: string) => (url = event)"
      ></DownloadSan>
    </template>
    <template v-else>
      <p>
        <DownloadSwitcher @update:type="(event: DownloadType) => (type = event)"></DownloadSwitcher>
      </p>
    </template>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
