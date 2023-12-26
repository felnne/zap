<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref } from 'vue'

import { fetchCitation, formatCitation } from '../utils/crosscite'
import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'

const doi = '10.5285/70ac5759-34ee-4f39-9069-2116db592340'

let doiCitation = ref('')

const getCitation = async () => {
  doiCitation.value = await fetchCitation(doi)
}

let initialCitation: ComputedRef<string> = computed(() => {
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
        Original DOI Citation (via CrossCite, APA style):
      </p>
      <div class="w-full p-2 border border-gray-400 prose-sm max-w-none mb-2" v-html="doiCitation"></div>
      <p>
        <em
          >This original citation is used as the initial citation text below with
          <a href="#" class="underline text-blue-600 dark:text-blue-200">some modifications</a>.</em
        >
      </p>
    </div>
    <Freetext v-if="doiCitation" :initial-input="initialCitation" input-class="min-h-60" />
  </section>
</template>
