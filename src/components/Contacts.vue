<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

import individualsData from '../data/individuals.json'
import organisationsData from '../data/organisations.json'

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

type Individual = {
  name: string
  orcid: string
  email: string
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

type Contact = {
  individual: {
    name: string
    href: string
    title: string
  }
  organisation: {
    name: string
    href: string
    title: string
  }
  email: string
  online_resource: {
    href: string
    title: string
    description: string
    function: string
  }
  role: string[]
}

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
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="contacts" title="Contacts" />
    <form>
      <label v-for="individual in individuals" :key="individual.email">
        <input
          type="checkbox"
          name="individuals"
          :id="'individual-' + individual.email"
          :checked="isChecked(individual.email)"
          @change="toggleCheck(individual.email)"
        />
        {{ individual.name }}
      </label>
    </form>
    <Output :data="contacts"></Output>
  </section>
</template>
