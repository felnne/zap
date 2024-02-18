<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType } from '@/types/enum'
import type { Licence, Organisation } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getOrganisation } from '@/utils/data'
import { stageFile } from '@/utils/upload'
import { createDownloadDistributionOption, getDistributorOrgSlug } from '@/utils/distribution'

import Output from '@/components/Output.vue'
import SubSectionBorder from '@/components/SubSectionBorder.vue'
import FormLabel from '@/components/FormLabel.vue'
import FormInput from '@/components/FormInput.vue'
import Button from '@/components/Button.vue'

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

const onFileChange = (e: Event) => {
  let files = (e.target as HTMLInputElement).files
  if (files) file.value = files[0]
}

const clearFile = () => {
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFile = async () => {
  if (!file.value) return

  try {
    let stagedFileUrl = await stageFile(file.value, props.fileIdentifier)
    console.log('stagedFileUrl', stagedFileUrl)
    url.value = stagedFileUrl
  } catch (e: any) {
    if (e instanceof Error) {
      if (e.message.includes('error-file-exists')) {
        alert('File already exists. Rename and add again.')
      } else {
        alert(e.message)
      }
    }
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
        <Button v-if="file" :id="'download-' + index + '-upload'" @click="uploadFile"
          >Upload</Button
        >
      </div>
      <div class="flex flex-grow space-x-2">
        <FormLabel class="text-neutral-500">URL</FormLabel>
        <FormInput
          type="text"
          name="'download-' + index + '-url'"
          :id="'download-' + index + '-url'"
          v-model="url"
        />
      </div>
    </div>
    <Output
      v-if="distributionOption"
      :id="'download-' + index + '-output'"
      :data="distributionOption"
    ></Output>
  </SubSectionBorder>
</template>
