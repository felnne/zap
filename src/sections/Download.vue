<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType } from '@/types/enum'
import type { Licence, Organisation } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getOrganisation } from '@/utils/data'
import { createDownloadDistributionOption, getDistributorOrgSlug } from '@/utils/distribution'

import Output from '@/components/Output.vue'
import SubSectionBorder from '@/components/SubSectionBorder.vue'
import FormLabel from '@/components/FormLabel.vue'
import FormInput from '@/components/FormInput.vue'

const props = defineProps({
  index: {
    type: Number,
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
let url = ref<string>('')

let distributor: ComputedRef<Organisation> = computed(() => {
  const distributorSlug = getDistributorOrgSlug(props.resourceType, props.licence)
  if (!distributorSlug) {
    throw new Error('No distributor.')
  }
  return getOrganisation(distributorSlug)
})

let distributionOption: ComputedRef<DistributionOption | boolean | null> = computed(() => {
  if (!file.value) return null

  try {
    return createDownloadDistributionOption(file.value, url.value, distributor.value)
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
    <form class="flex space-x-4">
      <div class="flex space-x-2">
        <FormLabel class="text-neutral-500">File</FormLabel>
        <input
          ref="fileInput"
          class="file:cursor-pointer file:border file:border-black file:bg-white file:px-2 file:py-1 file:text-xs file:shadow file:hover:bg-neutral-100"
          type="file"
          :id="'download-' + index + '-file'"
          @change="onFileChange"
        />
      </div>
      <div class="flex flex-grow space-x-2">
        <FormLabel class="text-neutral-500">URL</FormLabel>
        <FormInput
          type="text"
          name="identifier-bas-gitlab-id"
          :id="'download-' + index + '-url'"
          v-model="url"
        />
      </div>
    </form>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
