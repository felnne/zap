<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { getIndividuals, getOrganisation } from '@/lib/data'
import { createAuthor } from '@/lib/contacts'
import type { PointOfContact as Contact } from '@/types/iso'
import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:contacts': [id: Contact[]]
  'update:isoContacts': [id: Contact[]]
}>()

const individuals = getIndividuals()
const orgBas = getOrganisation('bas')

let selectedSlugs = ref<string[]>([])

let contacts: ComputedRef<Contact[]> = computed(() => {
  const selectedIndividuals = individuals.filter((individual) =>
    selectedSlugs.value.includes(individual.slug)
  )
  return selectedIndividuals.map((individual) => createAuthor(individual, orgBas))
})

watch(
  () => contacts.value,
  () => {
    emit('update:contacts', contacts.value)
    emit('update:isoContacts', contacts.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Experimental"
      version="3.0"
      anchor="contacts"
      title="Contacts"
      sub-title="Authors"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#contacts"
      :data-file-href="['individuals.json', 'organisations.json']"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <FormLabel v-for="individual in individuals" :key="individual.slug">
            <input
              :id="'individual-' + individual.slug"
              v-model="selectedSlugs"
              type="checkbox"
              name="individuals"
              :value="individual.slug"
            />
            {{ individual.name }}
          </FormLabel>
        </div>
      </template>
      <template #right><Output :data="contacts"></Output></template>
    </TwoColumn>
  </SectionBorder>
</template>
