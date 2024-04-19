<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getOrganisation } from '@/lib/data'
import { createDownloadDistributionOption, getDistributorOrgSlug } from '@/lib/distribution'

import Output from '@/components/bases/Output.vue'
import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'
import DownloadFile from '@/components/sections/elements/DownloadFile.vue'

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

let format = ref<Format | null>(null)
let url = ref<string>('')

let distributor: ComputedRef<Organisation> = computed(() => {
  const distributorSlug = getDistributorOrgSlug(props.resourceType, props.licence)
  if (!distributorSlug) {
    throw new Error('No distributor.')
  }
  return getOrganisation(distributorSlug)
})

let distributionOption: ComputedRef<DistributionOption | null> = computed(() => {
  if (!format.value) return null
  if (!distributor.value) return null

  return createDownloadDistributionOption(format.value, url.value, distributor.value)
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
    <DownloadFile
      :index="index"
      :file-identifier="fileIdentifier"
      @update:format="(event: Format) => (format = event)"
      @update:url="(event: string) => (url = event)"
    ></DownloadFile>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
