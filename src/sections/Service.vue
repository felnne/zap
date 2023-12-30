<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import FormInput from '@/components/FormInput.vue'
import SubSectionBorder from '@/components/SubSectionBorder.vue'

import servicesData from '@/data/services.json'
import organisationsData from '@/data/organisations.json'

import type { Organisation, Service, ServiceFormat } from '@/types/app'
import type { DistributionOption, OnlineResource, PointOfContact as Contact } from '@/types/iso'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const nullFormat: ServiceFormat = {
  name: '',
  href: '',
  version: ''
}
const nullService: Service = {
  slug: '',
  name: '',
  description: '',
  format: nullFormat
}

const service: Service = (servicesData.services as any)[props.slug] ?? nullService
const orgMagic: Organisation = organisationsData.organisations['basMagic']

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
      format: service.format.name,
      href: service.format.href,
      version: service.format.version
    },
    transfer_option: {
      online_resource: onlineResource.value
    },
    distributor: distributor
  }
})
</script>

<template>
  <SubSectionBorder>
    <form class="flex space-x-4">
      <FormLabel>
        <input
          type="checkbox"
          name="services"
          :id="'service-' + service.slug + '-selection'"
          v-model="selected"
        />
        {{ service.name }}
      </FormLabel>
      <div class="flex flex-grow space-x-2">
        <FormLabel :for="'service-' + service.slug + '-endpoint'" class="text-neutral-500">Endpoint</FormLabel>
        <FormInput
          type="url"
          :name="'service-' + service.slug + '-endpoint'"
          :id="'service-' + service.slug + '-endpoint'"
          :disabled="!selected"
          v-model="endpoint"
        />
      </div>
    </form>
    <Output v-show="selected" :data="distributionOption"></Output>
  </SubSectionBorder>
</template>
