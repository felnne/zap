<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import ClipboardCopy from './ClipboardCopy.vue'

import servicesData from '../data/services.json'
import organisationsData from '../data/organisations.json'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

type Service = {
  slug: string
  name: string
  description: string
  format: string
}

type Format = {
  format: string
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
  online_resource: OnlineResource
}

type DistributionOption = {
  format: Format
  transfer_option: TransferOption
  distributor: Distributor
}

const nullService: Service = {
  slug: '',
  name: '',
  description: '',
  format: ''
}

const service: Service = (servicesData.services as any)[props.slug] ?? nullService
const orgMagic: Organisation = organisationsData.organisations['basMagic']

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

let selected = ref<boolean>(false)
let endpoint = ref<string>('')

let onlineResource: ComputedRef<OnlineResource> = computed(() => {
  return {
    href: endpoint.value,
    title: service.name,
    description: service.description,
    function: 'download'
  }
})

let distributionOption: ComputedRef<DistributionOption> = computed(() => {
  return {
    format: {
      format: service.format
    },
    transfer_option: {
      online_resource: onlineResource.value
    },
    distributor: distributor
  }
})
</script>

<template>
  <div class="border-2 border-rose-500">
    <form>
      <label>
        <input
          type="checkbox"
          name="services"
          :id="'service-' + service.slug + '-selection'"
          v-model="selected"
        />
        {{ service.name }}
      </label>
      <label>Endpoint</label>
      <input
        type="url"
        name="'service-' + service.slug + '-endpoint'"
        :id="'service-' + service.slug + '-endpoint'"
        :disabled="!selected"
        v-model="endpoint"
      />
    </form>
    <div v-show="selected">
      <code>{{ distributionOption }}</code>
      <ClipboardCopy :data="distributionOption" />
    </div>
  </div>
</template>
