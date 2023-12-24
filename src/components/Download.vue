<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import ClipboardCopy from './ClipboardCopy.vue'

import formatsData from '../data/formats.json'
import organisationsData from '../data/organisations.json'

type Format = {
  slug: string
  ext: string[]
  name: string
  version: string
  url: string
}

type DistributionFormat = {
  format: string
  href: string
  version: string
}

type Size = {
  unit: string
  magnitude: number
}

type OnlineResource = {
  href: string
  title: string
  description: string
  function: string
}

type Address = {
  delivery_point: string
  city: string
  administrative_area: string
  postal_code: string
  country: string
}

type Organisation = {
  slug: string
  name: string
  ror: string
  email?: string
  phone: string
  address: Address
  online_resource: OnlineResource
}

type Distributor = {
  organisation: {
    name: string
    href: string
    title: string
  }
  phone: string
  address: Address
  email: string
  online_resource: OnlineResource
  role: string[]
}

type TransferOption = {
  size: Size
  online_resource: OnlineResource
}

type DistributionOption = {
  format: DistributionFormat
  transfer_option: TransferOption
  distributor: Distributor
}

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
const distributor: Distributor = {
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

let distributionFormat: ComputedRef<DistributionFormat> = computed(() => {
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
  <div class="border-2 border-rose-500">
    <form>
      <input type="file" :id="'download-' + index" @change="onFileChange" />
    </form>
    <code>{{ distributionOption }}</code>
    <ClipboardCopy :data="distributionOption" />
  </div>
</template>
