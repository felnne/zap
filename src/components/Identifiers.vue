<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionTitle from './SectionTitle.vue'
import ClipboardCopy from './ClipboardCopy.vue'

type Identifier = {
  identifier: string
  href: string
  title: string
}

const props = defineProps({
  fileIdentifier: String
})

const createSelfIdentifier = () => {
  const selfIdentifierValue = `https://data.bas.ac.uk/items/${props.fileIdentifier}`
  const selfIdentifier: Identifier = {
    identifier: selfIdentifierValue,
    href: selfIdentifierValue,
    title: 'self'
  }
  identifiers.value.push(selfIdentifier)
}

const identifiers = ref<Identifier[]>([])

watch(
  () => props.fileIdentifier,
  () => {
    identifiers.value = []
    createSelfIdentifier()
  }
)
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="identifiers" title="Identifiers" />
    <code>
      <pre>{{ identifiers }}</pre>
    </code>
    <ClipboardCopy :data="identifiers" />
    <p>
      <em
        >Add checkbox to include an identifier for a DOI based on the file identifier (e.g.
        ADD).</em
      >
    </p>
    <p><em>Add checkbox to include an identifier for a related Esri item.</em></p>
  </section>
</template>
