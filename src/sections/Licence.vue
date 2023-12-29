<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from '../components/Output.vue'
import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import FormLabel from '../components/FormLabel.vue'

import type { Licence } from '../types/app'
import type { Constraint } from '../types/iso'

import licencesData from '../data/licences.json'

function createConstraint(licence: Licence): Constraint {
  return {
    type: 'usage',
    restriction_code: 'license',
    statement: licence.name,
    href: licence.url
  }
}

const licences: Record<string, Licence> = Object.values(licencesData.licences).reduce(
  (acc: Record<string, Licence>, licence: Licence) => {
    acc[licence.url] = licence
    return acc
  },
  {}
)

let selectedLicenceUrl = ref<string>(Object.keys(licences)[0])

let licenceConstraint: ComputedRef<Constraint> = computed(() => {
  return createConstraint(licences[selectedLicenceUrl.value])
})
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="licence" title="Licence" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <FormLabel v-for="licence in licences" :key="licence.url">
          <input
            type="radio"
            name="licences"
            :id="'licence-' + licence.url"
            :value="licence.url"
            v-model="selectedLicenceUrl"
          />
          {{ licence.name }}
        </FormLabel>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="licenceConstraint"></Output>
      </div>
    </div>
  </SectionBorder>
</template>
