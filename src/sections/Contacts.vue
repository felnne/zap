<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { getIndividuals, getOrganisation } from '@/utils/data'
import { createContact } from '@/utils/contacts'
import type { PointOfContact as Contact } from '@/types/iso'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const emit = defineEmits<{
  'update:contacts': [id: Contact[]]
}>()

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
    <SectionTitle version="2.2" anchor="contacts" title="Contacts" sub-title="Authors" />
    <TwoColumn>
      <template v-slot:left>
        <div class="space-y-2">
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
        </div>
      </template>
      <template v-slot:right><Output :data="contacts"></Output></template>
    </TwoColumn>
  </SectionBorder>
</template>
