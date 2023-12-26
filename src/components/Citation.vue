<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref } from 'vue'

import { fetchFakeCitation, formatCitation } from '../utils/crosscite'
import type { Individual } from '../types/app'

import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'

const names: string[] = ['Watson, Connie', 'Cinnamon, John', 'Rust, Samatha']
const year = 2004
const title = 'Resource title'
const edition = '1.0'
const resource_type = 'dataset'
const publisher = 'Mapping and Geographic Information Centre, British Antarctic Survey'
const fileIdentifier = '93a1479e-8379-4820-b510-ef8a7639d29d'
const doiPrefix = '10.5285'
const doi = `${doiPrefix}/${fileIdentifier}`

let doiCitation = ref('')
const freetextInput = ref('')

const getCitation = async () => {
  // in time these will come from other components
  const authors: Individual[] = names.map((name) => ({
    name: name,
    orcid: '0000-0000-0000-0000',
    email: 'xxx@bas.ac.uk'
  }))

  doiCitation.value = await fetchFakeCitation(
    authors,
    year,
    title,
    edition,
    resource_type,
    publisher,
    doi
  )

  // doiCitation.value = await fetchCitation(doi)
}

const setFreetextInput = () => {
  freetextInput.value = doiCitationFormatted.value
}

let doiCitationFormatted: ComputedRef<string> = computed(() => {
  return formatCitation(doi, doiCitation.value)
})

onMounted(() => {
  getCitation()
})
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="citation" title="Citation" />
    <div class="mb-8">
      <p class="text-gray-500 dark:text-gray-300 mb-2">
        DOI Citation (fake but representative of CrossCite using APA style):
      </p>
      <div
        class="w-full p-2 border border-gray-400 prose-sm max-w-none mb-2"
        v-html="doiCitation"
      ></div>
      <div class="space-x-2 flex items-center">
        <button
          @click="setFreetextInput"
          class="py-1 px-2 text-xs font-medium border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-400 shadow"
        >
          Copy to input
        </button>
        <em
          >Click this button to use this citation, with
          <a
            href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/src/utils/crosscite.ts#L66"
            class="underline text-blue-600 dark:text-blue-200"
            >some modifications</a
          >, into the input below.</em
        >
      </div>
    </div>
    <Freetext v-if="doiCitation" :input="freetextInput" input-class="min-h-60" />
  </section>
</template>
