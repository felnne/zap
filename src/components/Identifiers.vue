<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

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
  identifiers.value = [...identifiers.value, selfIdentifier]
}

const identifiers = ref<Identifier[]>([{ identifier: 'x', href: 'xx', title: 'xxx' }])

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
    <Output :data="identifiers"></Output>
  </section>
</template>
