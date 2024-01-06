<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import { getLicences, getLicence } from '@/utils/data'
import { createConstraint } from '@/utils/constraints'
import type { Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

import Output from '@/components/Output.vue'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const licences = getLicences()

let selectedLicenceSlug = ref<string>(licences[0].slug)

let licenceConstraint: ComputedRef<Constraint> = computed(() => {
  return createConstraint(getLicence(selectedLicenceSlug.value))
})
</script>

<template>
  <SectionBorder>
    <SectionTitle version="2.0" anchor="licence" title="Licence" />
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
