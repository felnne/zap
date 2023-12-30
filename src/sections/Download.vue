<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from '../components/Output.vue'
import SubSectionBorder from '../components/SubSectionBorder.vue'

import type { Format, Organisation } from '../types/app'
import type {
  DistributionOption,
  Format as FormatIso,
  PointOfContact as Contact,
  OnlineResource,
  Size
} from '../types/iso'

import formatsData from '../data/formats.json'
import organisationsData from '../data/organisations.json'

defineProps({
  index: Number
})

const formats: Format[] = Object.values(formatsData.formats)
const orgMagic: Organisation = organisationsData.organisations['basMagic']

const unknownFormat: Format = {
  slug: 'unknown',
  ext: [],
  name: 'Unknown',
  version: '...',
  url: '...'
}
const distributor: Contact = {
  organisation: {
    name: orgMagic.name,
    href: orgMagic.ror,
    title: 'ror'
  },
  phone: orgMagic.phone,
  address: orgMagic.address,
  email: orgMagic.email!,
  online_resource: orgMagic.online_resource,
  role: ['distributor']
}
const onlineResource: OnlineResource = {
  href: '...',
  title: '...',
  description: '...',
  function: 'download'
}

function onFileChange(e: Event) {
  let files = (e.target as HTMLInputElement).files
  if (files) selectedFile.value = files[0]
}

let selectedFile = ref<File | null>(null)

let fileExtension: ComputedRef<string> = computed(() => {
  if (!selectedFile.value) return ''
  let parts = selectedFile.value.name.split('.')
  return parts.length > 1 ? parts.pop()! : ''
})

let fileSize: ComputedRef<number> = computed(() => {
  return selectedFile.value ? selectedFile.value.size : 0
})

let format: ComputedRef<Format> = computed(() => {
  return formats.find((format) => format.ext.includes(`.${fileExtension.value}`)) || unknownFormat
})

let distributionFormat: ComputedRef<FormatIso> = computed(() => {
  return {
    format: format.value.name,
    href: format.value.url,
    version: format.value.version
  }
})

let distributionSize: ComputedRef<Size> = computed(() => {
  return {
    unit: 'bytes',
    magnitude: fileSize.value
  }
})

let distributionOption: ComputedRef<DistributionOption> = computed(() => {
  return {
    format: distributionFormat.value,
    transfer_option: {
      size: distributionSize.value,
      online_resource: onlineResource
    },
    distributor: distributor
  }
})
</script>

<template>
  <SubSectionBorder class="space-y-2">
    <form>
      <input
        class="file:py-1 file:px-2 file:text-xs file:border file:bg-white file:border-black file:hover:bg-neutral-100 file:shadow file:cursor-pointer"
        type="file"
        :id="'download-' + index"
        @change="onFileChange"
      />
    </form>
    <Output :data="distributionOption"></Output>
  </SubSectionBorder>
</template>
