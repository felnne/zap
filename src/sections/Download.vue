<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref } from 'vue'

import { ResourceType } from '@/types/enum'
import { getOrganisation } from '@/utils/data'
import { createDownloadDistributionOption } from '@/utils/distribution'
import type { DistributionOption } from '@/types/iso'

import Output from '@/components/Output.vue'
import SubSectionBorder from '@/components/SubSectionBorder.vue'
import type { Organisation } from '@/types/app'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true
  }
})

const orgMagic = getOrganisation('bas_magic')
const orgPdc = getOrganisation('nerc_eds_pdc')
const endpoint = '...'

function onFileChange(e: Event) {
  let files = (e.target as HTMLInputElement).files
  if (files) file.value = files[0]
}

let file = ref<File | null>(null)

let distributor: ComputedRef<Organisation> = computed(() => {
  if (props.resourceType === ResourceType.Dataset) return orgPdc
  return orgMagic
})

let distributionOption: ComputedRef<DistributionOption | null> = computed(() => {
  if (!file.value) return null

  return createDownloadDistributionOption(file.value, endpoint, distributor.value)
})
</script>

<template>
  <SubSectionBorder class="space-y-2">
    <form>
      <input
        class="file:py-1 file:px-2 file:text-xs file:border file:bg-white file:border-black file:hover:bg-neutral-100 file:shadow file:cursor-pointer"
        type="file"
        :id="'download-' + index + '-input'"
        @change="onFileChange"
      />
    </form>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
