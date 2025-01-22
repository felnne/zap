<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import type { Collection, DropdownItem, Record } from '@/types/app'
import type { Identifier } from '@/types/iso'
import { CitationTemplate, Stability, SectionType } from '@/types/enum'
import { getPublisherOrgSlug } from '@/lib/contacts'
import {
  createCitationDataset,
  createCitationMagicMapsGeneral,
  createCitationMagicMapsPublished,
  formatCitationAsMarkdown,
  filterCitationTemplates,
  defaultCitationTemplate,
} from '@/lib/citation'
import { getOrganisation } from '@/lib/data'

import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Button from '@/components/bases/Button.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionLabel from '@/components/bases/SectionLabel.vue'
import Prose from '@/components/bases/Prose.vue'

const props = defineProps({
  collections: {
    type: Array as () => Collection[],
    required: true,
  },
  record: {
    type: Object as () => Record,
    required: true,
  },
})

const emit = defineEmits<{
  'update:isoOtherCitationDetails': [id: string]
}>()

const getCitation = () => {
  if (template.value === CitationTemplate.dataset) {
    citation.value = createCitationDataset(
      authors.value,
      publicationYear.value,
      title.value,
      props.record.edition,
      publisher.value,
      identifier.value
    )
  } else if (template.value === CitationTemplate.productMapMagicGeneral) {
    citation.value = createCitationMagicMapsGeneral(
      creationYear.value,
      props.record.edition,
      identifier.value
    )
  } else if (template.value === CitationTemplate.productMapMagicPublished) {
    citation.value = createCitationMagicMapsPublished(
      creationYear.value,
      title.value,
      -1,
      '?series',
      '?sheet',
      props.record.edition
    )
  } else {
    citation.value = '[Error: Unknown citation template]'
  }
}

const copyFromPreview = () => {
  markdownInput.value = formatCitationAsMarkdown(citation.value, identifier.value.href)
}

const dependantSections: DropdownItem[] = [
  { href: '#collections', title: 'Collections' },
  { href: '#contacts', title: 'Contacts' },
  { href: '#dates', title: 'Dates' },
  { href: '#edition', title: 'Edition' },
  { href: '#identifiers', title: 'Identifiers' },
  { href: '#licence', title: 'Licence' },
  { href: '#resource-type', title: 'Resource Type' },
  { href: '#title', title: 'Title' },
]

let template = ref<CitationTemplate>(CitationTemplate.unknown)
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

let authors: ComputedRef<string[]> = computed(() => {
  if (props.record.contacts.length === 0) {
    return ['?authors']
  }
  return props.record.contacts
    .map((contact) => contact.individual?.name ?? '')
    .filter((contact) => contact !== '')
})

let title: ComputedRef<string> = computed(() => {
  if (props.record.title === '') {
    return '?title'
  }
  return props.record.title
})

let creationYear: ComputedRef<string> = computed(() => {
  const creationDate = props.record.dates.find((date) => date.label === 'creation')
  if (creationDate) {
    return String(creationDate.date.js.getFullYear())
  }
  return '?creation_year'
})

let publicationYear: ComputedRef<string> = computed(() => {
  const publicationDate = props.record.dates.find((date) => date.label === 'publication')
  if (publicationDate) {
    return String(publicationDate.date.js.getFullYear())
  }
  return '?publication_year'
})

let publisher: ComputedRef<string> = computed(() => {
  const publisher = getOrganisation(
    getPublisherOrgSlug(props.record.resourceType, props.record.licence)
  )
  return publisher.name
})

let availableCitationTemplates: ComputedRef<CitationTemplate[]> = computed(() => {
  return filterCitationTemplates(props.record.resourceType)
})

onMounted(() => {
  template.value = defaultCitationTemplate(props.collections, props.record.resourceType)
  getCitation()
})

watch([() => props.collections, () => props.record.resourceType], () => {
  template.value = defaultCitationTemplate(props.collections, props.record.resourceType)
  getCitation()
})

watch(
  [
    () => template.value,
    () => props.record.resourceType,
    () => identifier.value,
    () => props.record.edition,
    () => props.record.title,
    () => creationYear.value,
    () => publicationYear.value,
    () => authors.value,
    () => props.record.licence,
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
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Experimental"
      version="6.0"
      anchor="citation"
      title="Citation"
      :data-file-href="['organisations.json']"
      :depends-on="dependantSections"
    />
    <div class="mb-10 space-y-2">
      <SectionLabel>Constructed citation</SectionLabel>
      <Prose id="citation-preview" :prose-classes="['prose-sm']" :content="citation"></Prose>
      <div class="flex items-center space-x-2">
        <FormLabel for="citation-template" class="text-neutral-500">Template</FormLabel>
        <select
          id="citation-template"
          v-model="template"
          name="citation-template"
          class="border border-black bg-white disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-white dark:bg-black dark:disabled:bg-neutral-700"
        >
          <option v-for="option in availableCitationTemplates" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex items-center space-x-2">
        <Button id="citation-use-generated" @click="copyFromPreview">Copy From Preview</Button>
        <GuidanceText
          >Click to copy this generated citation into the input below (replacing any existing
          value).
        </GuidanceText>
      </div>
    </div>
    <Markdown
      v-if="citation"
      input-id="citation-input"
      :input="markdownInput"
      @update:input="(event: string) => (otherCitationDetails = event)"
    />
  </SectionBorder>
</template>
