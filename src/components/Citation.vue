<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { fetchFakeCitation, formatCitation } from '../utils/citation'
import type { DateImprecise, Organisation } from '../types/app'
import type { PointOfContact as Contact, Identifier } from '../types/iso'

import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'

import organisationsData from '../data/organisations.json'

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
  dates: {
    type: Array as () => DateImprecise[],
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

const orgMagic: Organisation = organisationsData.organisations['basMagic']
const orgPdc: Organisation = organisationsData.organisations['nercEdsPdc']

let citation = ref<string>('')
let freetextInput = ref<string>('')

const getCitation = async () => {
  citation.value = await fetchFakeCitation(
    authors.value,
    publishedYear.value,
    props.title,
    props.edition,
    props.resourceType,
    publisher.value,
    identifier.value
  )

  // use to get the citation for real DOIs from CrossCite
  // citation.value = await fetchCitation(doi.value)
}

const setFreetextInput = () => {
  freetextInput.value = citationFormatted.value
}

const nullIdentifier: Identifier = {
  identifier: '',
  href: '',
  title: 'null'
}

let identifier: ComputedRef<Identifier> = computed(() => {
  /*
   * Pick identifier to use in citation.
   *
   * DOI identifiers are preferred, then data catalogue identifiers. DOIs are preferred because they have stronger
   * persistence and immutability guarantees.
   *
   * If neither of these identifiers are available, a null identifier if returned.
   */
  const doiIdentifier = props.identifiers.find((i) => i.title === 'doi')
  if (doiIdentifier) {
    return doiIdentifier
  }

  const selfIdentifier = props.identifiers.find((i) => i.title === 'data.bas.ac.uk')
  if (selfIdentifier) {
    return selfIdentifier
  }

  return nullIdentifier
})

let doi: ComputedRef<string> = computed(() => {
  if (identifier.value.title === 'doi') {
    return identifier.value.identifier
  }
  return ''
})

let authors: ComputedRef<string[]> = computed(() => {
  return props.contacts
    .map((contact) => contact.individual?.name ?? '')
    .filter((contact) => contact !== '')
})

let publishedYear: ComputedRef<string> = computed(() => {
  const publishedDate = props.dates.find((date) => date.label === 'published')
  if (publishedDate) {
    return String(publishedDate.value.getFullYear())
  }
  return '?'
})

let publisher: ComputedRef<string> = computed(() => {
  if (identifier.value.title === 'doi') {
    return orgPdc.name
  }
  return orgMagic.name
})

let citationFormatted: ComputedRef<string> = computed(() => {
  return formatCitation(citation.value, identifier.value.href, doi.value)
})

onMounted(() => {
  getCitation()
})

watch(
  [
    () => props.resourceType,
    () => identifier.value,
    () => props.edition,
    () => props.title,
    () => publishedYear.value,
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
      <p class="text-gray-500 dark:text-gray-300 mb-2">Constructed citation (APA style):</p>
      <div
        class="w-full p-2 border text-black dark:text-white border-gray-400 prose-sm max-w-none mb-2"
        v-html="citation"
      ></div>
      <div class="space-x-2 flex items-center">
        <button
          @click="setFreetextInput"
          class="py-1 px-2 text-xs font-medium border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-400 shadow"
        >
          Copy to input
        </button>
        <em class="text-black dark:text-white"
          >Click to copy this citation, with
          <a
            href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/src/utils/crosscite.ts#L66"
            class="underline text-blue-600 dark:text-blue-200"
            target="_blank"
            rel="noopener"
            >some modifications</a
          >, into the input below.</em
        >
      </div>
    </div>
    <Freetext v-if="citation" :input="freetextInput" input-class="min-h-60" />
  </section>
</template>
