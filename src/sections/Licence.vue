<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from '@/components/Output.vue'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

import type { Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

import licencesData from '@/data/licences.json'

function createConstraint(licence: Licence): Constraint {
  return {
    type: 'usage',
    restriction_code: 'license',
    statement: licence.statement,
    href: licence.url
  }
}

const licences: Record<string, Licence> = licencesData.licences

let selectedLicenceSlug = ref<string>(Object.keys(licences)[0])

let licenceConstraint: ComputedRef<Constraint> = computed(() => {
  return createConstraint(licences[selectedLicenceSlug.value])
})
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="licence" title="Licence" />
    <TwoColumn>
      <template v-slot:left>
        <FormLabel v-for="licence in licences" :key="licence.slug">
          <input
            type="radio"
            name="licences"
            :id="'licence-' + licence.slug"
            :value="licence.slug"
            v-model="selectedLicenceSlug"
          />
          {{ licence.name }}
        </FormLabel>
      </template>
      <template v-slot:right>
        <Output :data="licenceConstraint"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
