<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { DistributionOption } from '@/types/iso'
import { createOrgPointOfContact } from '@/lib/contacts'
import { getOrganisation, getService } from '@/lib/data'
import { createServiceDistributionOption } from '@/lib/distribution'

import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import SubSectionBorder from '@/components/bases/SubSectionBorder.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:selected': [id: boolean]
  'update:isoDistributionOption': [id: DistributionOption]
}>()

const service = getService(props.slug)
const distributor = createOrgPointOfContact(getOrganisation('bas_magic'), 'distributor') // will always be MAGIC

let selected = ref<boolean>(false)
let endpoint = ref<string>('')

let distributionOption: ComputedRef<DistributionOption> = computed(() => {
  return createServiceDistributionOption(service, endpoint.value, distributor)
})

watch(
  () => selected.value,
  () => {
    emit('update:selected', selected.value)
  }
)

watch(
  () => distributionOption.value,
  () => {
    emit('update:isoDistributionOption', distributionOption.value)
  }
)
</script>

<template>
  <SubSectionBorder class="space-y-2">
    <form class="flex space-x-4">
      <FormLabel>
        <input
          :id="'service-' + service.slug + '-selection'"
          v-model="selected"
          type="checkbox"
          name="services"
        />
        {{ service.name }}
      </FormLabel>
      <div class="flex flex-grow space-x-2">
        <FormLabel :for="'service-' + service.slug + '-endpoint'" class="text-neutral-500"
          >Endpoint</FormLabel
        >
        <FormInput
          :id="'service-' + service.slug + '-endpoint'"
          v-model="endpoint"
          type="url"
          :name="'service-' + service.slug + '-endpoint'"
          :disabled="!selected"
        />
      </div>
    </form>
    <Output v-show="selected" :data="distributionOption"></Output>
  </SubSectionBorder>
</template>
