<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import ClipboardCopy from './ClipboardCopy.vue'
import SectionTitle from './SectionTitle.vue'

import licencesData from '../data/licences.json'

type Licence = {
  name: string
  url: string
}

type Constraint = {
  type: string
  restriction_code: string
  statement: string
  href: string
}

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
    <form>
      <label v-for="licence in licences" :key="licence.url">
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
    <code>
      <pre>{{ licenceConstraint }}</pre>
    </code>
    <ClipboardCopy :data="licenceConstraint" />
  </section>
</template>
