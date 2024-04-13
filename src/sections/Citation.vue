<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { getPublisherOrgSlug } from '@/utils/contacts'
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

const emit = defineEmits<{
  'update:isoOtherCitationDetails': [id: string]
}>()

const getCitation = async () => {
  citation.value = await fetchFakeCitation(
    authors.value,
    publicationYear.value,
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

const citationProseClasses = ['prose-sm']

let citation = ref<string>('')
let markdownInput = ref<string>('')
let otherCitationDetails = ref<string>('')

let identifier: ComputedRef<Identifier> = computed(() => {
  /*
   * Pick identifier to use in citation.
   *
   * DOI identifiers are preferred, then data catalogue identifiers. DOIs are preferred because they have stronger
   * persistence and immutability guarantees.
   *
   * If neither of these identifiers are available, a null identifier if returned.
   */
  const doiIdentifier = props.record.identifiers.find((i) => i.namespace === 'doi')
  if (doiIdentifier) {
    return doiIdentifier
  }

  const selfIdentifier = props.record.identifiers.find((i) => i.namespace === 'data.bas.ac.uk')
  if (selfIdentifier) {
    return selfIdentifier
  }

  return { title: '', identifier: '', href: '' }
})

let doi: ComputedRef<string> = computed(() => {
  if (identifier.value.namespace === 'doi') {
    return identifier.value.identifier
  }
  return ''
})

let authors: ComputedRef<string[]> = computed(() => {
  return props.record.contacts
    .map((contact) => contact.individual?.name ?? '')
    .filter((contact) => contact !== '')
})

let publicationYear: ComputedRef<string> = computed(() => {
  const publicationDate = props.record.dates.find((date) => date.label === 'publication')
  if (publicationDate) {
    return String(publicationDate.date.js.getFullYear())
  }
  return ''
})

let publisher: ComputedRef<string> = computed(() => {
  const publisher = getOrganisation(
    getPublisherOrgSlug(props.record.resourceType, props.record.licence)
  )
  return publisher.name
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
    () => publicationYear.value,
    () => authors.value,
  ],
  () => {
    getCitation()
  }
)

watch(
  () => otherCitationDetails.value,
  () => {
    emit('update:isoOtherCitationDetails', otherCitationDetails.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="4.0" anchor="citation" title="Citation" />
    <div class="mb-10 space-y-2">
      <SectionLabel>Constructed citation (APA style)</SectionLabel>
      <Prose
        border-colour-class="border-black bg-neutral-100"
        :prose-classes="citationProseClasses"
        :content="citation"
        id="citation-preview"
      ></Prose>
      <div class="flex items-center space-x-2">
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
    <Markdown
      v-if="citation"
      input-id="citation-input"
      @update:input="(event: string) => (otherCitationDetails = event)"
      :input="markdownInput"
    />
  </SectionBorder>
</template>
