<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { fetchFakeCitation, formatCitation } from '@/utils/citation'
import { getOrganisation } from '@/utils/data'
import type { Record } from '@/types/app'
import type { Identifier } from '@/types/iso'

import SectionTitle from '@/components/SectionTitle.vue'
import Markdown from '@/components/Markdown.vue'
import GuidanceText from '@/components/GuidanceText.vue'
import Link from '@/components/Link.vue'
import Button from '@/components/Button.vue'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import Prose from '@/components/Prose.vue'

const props = defineProps({
  record: {
    type: Object as () => Record,
    required: true,
  },
})

const getCitation = async () => {
  citation.value = await fetchFakeCitation(
    authors.value,
    publishedYear.value,
    props.record.title,
    props.record.edition,
    props.record.resourceType,
    publisher.value,
    identifier.value
  )

  // use to get the citation for real DOIs from CrossCite
  // citation.value = await fetchCitation(doi.value)
}

const setMarkdownInput = () => {
  markdownInput.value = citationFormatted.value
}

const orgMagic = getOrganisation('bas_magic')
const orgPdc = getOrganisation('nerc_eds_pdc')
const citationProseClasses = ['prose-sm']

let citation = ref<string>('')
let markdownInput = ref<string>('')

let identifier: ComputedRef<Identifier> = computed(() => {
  /*
   * Pick identifier to use in citation.
   *
   * DOI identifiers are preferred, then data catalogue identifiers. DOIs are preferred because they have stronger
   * persistence and immutability guarantees.
   *
   * If neither of these identifiers are available, a null identifier if returned.
   */
  const doiIdentifier = props.record.identifiers.find((i) => i.title === 'doi')
  if (doiIdentifier) {
    return doiIdentifier
  }

  const selfIdentifier = props.record.identifiers.find((i) => i.title === 'data.bas.ac.uk')
  if (selfIdentifier) {
    return selfIdentifier
  }

  return { title: '', identifier: '', href: '' }
})

let doi: ComputedRef<string> = computed(() => {
  if (identifier.value.title === 'doi') {
    return identifier.value.identifier
  }
  return ''
})

let authors: ComputedRef<string[]> = computed(() => {
  return props.record.contacts
    .map((contact) => contact.individual?.name ?? '')
    .filter((contact) => contact !== '')
})

let publishedYear: ComputedRef<string> = computed(() => {
  const publishedDate = props.record.dates.find((date) => date.label === 'published')
  if (publishedDate) {
    return String(publishedDate.date.js.getFullYear())
  }
  return ''
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
    () => props.record.resourceType,
    () => identifier.value,
    () => props.record.edition,
    () => props.record.title,
    () => publishedYear.value,
    () => authors.value,
  ],
  () => {
    getCitation()
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="2.1" anchor="citation" title="Citation" />
    <div class="mb-10 space-y-2">
      <SectionLabel>Constructed citation (APA style)</SectionLabel>
      <Prose
        border-colour-class="border-black bg-neutral-100"
        :prose-classes="citationProseClasses"
        :content="citation"
        id="citation-preview"
      ></Prose>
      <div class="space-x-2 flex items-center">
        <Button @click="setMarkdownInput">Copy to input</Button>
        <GuidanceText
          >Click to copy this citation (with
          <Link
            href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/src/utils/crosscite.ts#L66"
            >some modifications</Link
          >) into the input below.</GuidanceText
        >
      </div>
    </div>
    <Markdown v-if="citation" :input="markdownInput" />
  </SectionBorder>
</template>
