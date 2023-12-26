<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import Output from './Output.vue'
import SectionTitle from './SectionTitle.vue'

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
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="licence" title="Licence" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <label v-for="licence in licences" :key="licence.url" class="text-black dark:text-white">
          <input
            type="radio"
            name="licences"
            :id="'licence-' + licence.url"
            :value="licence.url"
            v-model="selectedLicenceUrl"
          />
          {{ licence.name }}
        </label>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="licenceConstraint"></Output>
      </div>
    </div>
  </section>
</template>
