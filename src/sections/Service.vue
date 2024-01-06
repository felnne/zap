<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import { getOrganisation, getService } from '@/utils/data'
import { createServiceDistributionOption } from '@/utils/distribution'
import type { DistributionOption } from '@/types/iso'

import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import FormInput from '@/components/FormInput.vue'
import SubSectionBorder from '@/components/SubSectionBorder.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const service = getService(props.slug)
const orgMagic = getOrganisation('bas_magic')

let selected = ref<boolean>(false)
let endpoint = ref<string>('')

let distributionOption: ComputedRef<DistributionOption> = computed(() => {
  return createServiceDistributionOption(service, endpoint.value, orgMagic)
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
        <FormLabel :for="'service-' + service.slug + '-endpoint'" class="text-neutral-500"
          >Endpoint</FormLabel
        >
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
