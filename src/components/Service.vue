<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from './Output.vue'

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
  <div class="p-2 border-2 border-gray-400 space-y-2">
    <form class="flex space-x-4">
      <label>
        <input
          type="checkbox"
          name="services"
          :id="'service-' + service.slug + '-selection'"
          v-model="selected"
        />
        {{ service.name }}
      </label>
      <div class="flex flex-grow space-x-2">
        <label class="text-gray-500">Endpoint</label>
        <input
          class="flex-grow border border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
          type="url"
          name="'service-' + service.slug + '-endpoint'"
          :id="'service-' + service.slug + '-endpoint'"
          :disabled="!selected"
          v-model="endpoint"
        />
      </div>
    </form>
    <Output v-show="selected" pre-class="max-h-96" :data="distributionOption"></Output>
  </div>
</template>
