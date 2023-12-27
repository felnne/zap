<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { fetchFakeCitation, formatCitation } from '../utils/citation'
import type { PointOfContact as Contact, Identifier } from '../types/iso'

import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'

const props = defineProps({
  resourceType: {
    type: String,
    required: true
  },
  identifiers: {
    type: Array as () => Identifier[],
    required: true
  },
  edition: {
    type: String,
    required: true
  },
  contacts: {
    type: Array as () => Contact[],
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const year = 2004
const publisher = 'Mapping and Geographic Information Centre, British Antarctic Survey'

let doiCitation = ref<string>('')
let freetextInput = ref<string>('')

const getCitation = async () => {
  // in time these will come from other components
  doiCitation.value = await fetchFakeCitation(
    authors.value,
    year,
    props.title,
    props.edition,
    props.resourceType,
    publisher,
    doi.value
  )

  // doiCitation.value = await fetchCitation(doi.value)
}

const setFreetextInput = () => {
  freetextInput.value = citationFormatted.value
}

let doi: ComputedRef<string> = computed(() => {
  const doiIdentifier = props.identifiers.find((i) => i.title === 'doi')
  if (doiIdentifier) {
    console.log('sam')
    return doiIdentifier.identifier
  }
  return ''
})

let authors: ComputedRef<string[]> = computed(() => {
  return props.contacts
    .map((contact) => contact.individual?.name ?? '')
    .filter((contact) => contact !== '')
})

let citationFormatted: ComputedRef<string> = computed(() => {
  return formatCitation(doi.value, doiCitation.value)
})

onMounted(() => {
  getCitation()
})

watch(
  [
    () => props.resourceType,
    () => doi.value,
    () => props.edition,
    () => props.title,
    () => authors.value
  ],
  () => {
    getCitation()
  }
)
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="citation" title="Citation" />
    <div class="mb-8">
      <p class="text-gray-500 dark:text-gray-300 mb-2">
        DOI Citation (fake but representative of CrossCite using APA style):
      </p>
      <div
        class="w-full p-2 border text-black dark:text-white border-gray-400 prose-sm max-w-none mb-2"
        v-html="doiCitation"
      ></div>
      <div class="space-x-2 flex items-center">
        <button
          @click="setFreetextInput"
          class="py-1 px-2 text-xs font-medium border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-400 shadow"
        >
          Copy to input
        </button>
        <em class="text-black dark:text-white"
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
