<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

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
    required: true,
  },
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
})

const orgMagic = getOrganisation('bas_magic')
const orgPdc = getOrganisation('nerc_eds_pdc')
const endpoint = '...'

function onFileChange(e: Event) {
  let files = (e.target as HTMLInputElement).files
  if (files) file.value = files[0]
}

function clearFile() {
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

let file = ref<File | null>(null)
let fileInput = ref<HTMLInputElement | null>(null)

let distributor: ComputedRef<Organisation> = computed(() => {
  if (props.resourceType === ResourceType.Dataset) return orgPdc
  return orgMagic
})

let distributionOption: ComputedRef<DistributionOption | boolean | null> = computed(() => {
  if (!file.value) return null

  try {
    return createDownloadDistributionOption(file.value, endpoint, distributor.value)
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

watch(distributionOption, (value: DistributionOption | boolean | null) => {
  if (value === false) {
    clearFile()
  }
})
</script>

<template>
  <SubSectionBorder class="space-y-2">
    <form>
      <input
        ref="fileInput"
        class="file:cursor-pointer file:border file:border-black file:bg-white file:px-2 file:py-1 file:text-xs file:shadow file:hover:bg-neutral-100"
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
