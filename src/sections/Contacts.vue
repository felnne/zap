<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

import type { Individual, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'

import individualsData from '@/data/individuals.json'
import organisationsData from '@/data/organisations.json'

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

function isChecked(email: string) {
  return selectedEmails.value.includes(email)
}

function toggleCheck(email: string) {
  let index = selectedEmails.value.indexOf(email)
  if (index === -1) {
    selectedEmails.value.push(email)
  } else {
    selectedEmails.value.splice(index, 1)
  }
}

const individuals: Individual[] = Object.values(individualsData.contacts).sort(
  (a: Individual, b: Individual) => a.name.localeCompare(b.name)
)
const orgBas: Organisation = organisationsData.organisations['bas']

let selectedEmails = ref<string[]>([])

let contacts: ComputedRef<Contact[]> = computed(() => {
  const selectedIndividuals = individuals.filter((individual) =>
    selectedEmails.value.includes(individual.email)
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
        <FormLabel v-for="individual in individuals" :key="individual.email">
          <input
            type="checkbox"
            name="individuals"
            :id="'individual-' + individual.email"
            :checked="isChecked(individual.email)"
            @change="toggleCheck(individual.email)"
          />
          {{ individual.name }}
        </FormLabel>
      </template>
      <template v-slot:right><Output :data="contacts"></Output></template>
    </TwoColumn>
  </SectionBorder>
</template>
