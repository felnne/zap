<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { getIndividuals, getOrganisation } from '@/utils/data'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

import type { Individual, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'

const emit = defineEmits(['update:contacts'])

function createContact(individual: Individual, organisation: Organisation): Contact {
  return {
    individual: {
      name: individual.name,
      href: individual.orcid,
      title: 'ocrid'
    },
    organisation: {
      name: organisation.name,
      href: organisation.ror,
      title: 'ror'
    },
    email: individual.email,
    phone: organisation.phone,
    address: organisation.address,
    online_resource: {
      href: individual.orcid,
      title: 'ORCID record',
      description:
        'ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.',
      function: 'information'
    },
    role: ['author']
  }
}
const individuals = getIndividuals()
const orgBas = getOrganisation('bas')

let selectedSlugs = ref<string[]>([])

let contacts: ComputedRef<Contact[]> = computed(() => {
  const selectedIndividuals = individuals.filter((individual) =>
    selectedSlugs.value.includes(individual.slug)
  )
  return selectedIndividuals.map((individual) => createContact(individual, orgBas))
})

watch(
  () => contacts.value,
  () => {
    emit('update:contacts', contacts.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="contacts" title="Contacts" />
    <TwoColumn>
      <template v-slot:left>
        <FormLabel v-for="individual in individuals" :key="individual.slug">
          <input
            type="checkbox"
            name="individuals"
            :id="'individual-' + individual.slug"
            :value="individual.slug"
            v-model="selectedSlugs"
          />
          {{ individual.name }}
        </FormLabel>
      </template>
      <template v-slot:right><Output :data="contacts"></Output></template>
    </TwoColumn>
  </SectionBorder>
</template>
