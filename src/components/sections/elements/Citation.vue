<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import type { DropdownItem, Record } from '@/types/app'
import type { Identifier } from '@/types/iso'
import { CitationTemplate, Stability, SectionType } from '@/types/enum'
import {
  formatCitationAsMarkdown,
  filterCitationTemplates,
  defaultCitationTemplate,
  getPreferredReferenceIdentifier,
  getCitation,
} from '@/lib/citation'

import SectionTitle from '@/components/bases/SectionTitle.vue'
import Markdown from '@/components/bases/Markdown.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Button from '@/components/bases/Button.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionLabel from '@/components/bases/SectionLabel.vue'
import Prose from '@/components/bases/Prose.vue'

const props = defineProps({
  record: {
    type: Object as () => Record,
    required: true,
  },
})

const emit = defineEmits<{
  'update:isoOtherCitationDetails': [id: string]
}>()

const makeCitation = () => {
  const scale = props.record.scale ? props.record.scale : 0
  const series = props.record.series ? props.record.series.name : '?series'
  const sheet = props.record.series?.sheet ? props.record.series.sheet : '?sheet'

  citation.value = getCitation(
    template.value,
    authors.value,
    creationYear.value,
    publicationYear.value,
    title.value,
    props.record.edition,
    identifier.value,
    scale,
    series,
    sheet
  )
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
  { href: '#scale', title: 'Scale' },
  { href: '#series', title: 'Series' },
  { href: '#title', title: 'Title' },
]

let availableTemplates = ref<CitationTemplate[]>([])
let template = ref<CitationTemplate>(CitationTemplate.unknown)
let citation = ref<string>('')
let markdownInput = ref<string>('')
let otherCitationDetails = ref<string>('')

let identifier: ComputedRef<Identifier> = computed(() => {
  return getPreferredReferenceIdentifier(props.record.identifiers)
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

onMounted(() => {
  availableTemplates.value = filterCitationTemplates(
    props.record.resourceType,
    props.record.licence.open
  )
  template.value = defaultCitationTemplate(
    availableTemplates.value,
    props.record.collections,
    props.record.resourceType
  )
  makeCitation()
})

watch([() => props.record.resourceType, () => props.record.licence], () => {
  availableTemplates.value = filterCitationTemplates(
    props.record.resourceType,
    props.record.licence.open
  )
  template.value = defaultCitationTemplate(
    availableTemplates.value,
    props.record.collections,
    props.record.resourceType
  )
  makeCitation()
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
    makeCitation()
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
      :stability="Stability.Stable"
      version="7.1"
      anchor="citation"
      title="Citation"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#citation"
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
          <option v-for="option in availableTemplates" :key="option" :value="option">
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
