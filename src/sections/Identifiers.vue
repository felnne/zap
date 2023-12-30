<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Output from '../components/Output.vue'
import IdentifierSelf from './IdentifierSelf.vue'
import IdentifierDoi from './IdentifierDoi.vue'
import IdentifierEsri from './IdentifierEsri.vue'
import TwoColumn from '../components/TwoColumn.vue'

import type { Identifier } from '../types/iso'

defineProps({
  fileIdentifier: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:identifiers'])

const addIdentifier = (identifier: Identifier) => {
  identifiers.value = [...identifiers.value, identifier]
}

const removeIdentifier = (identifier: Identifier) => {
  identifiers.value = identifiers.value.filter((i) => i.identifier !== identifier.identifier)
}

const identifiers = ref<Identifier[]>([])

watch(
  () => identifiers.value,
  () => {
    emit('update:identifiers', identifiers.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="identifiers" title="Identifiers" />
    <TwoColumn>
      <template v-slot:left>
        <IdentifierSelf :fileIdentifier="fileIdentifier" @add:identifier="addIdentifier($event)" />
        <IdentifierDoi
          :fileIdentifier="fileIdentifier"
          @add:identifier="addIdentifier($event)"
          @remove:identifier="removeIdentifier($event)"
        />
        <IdentifierEsri
          @add:identifier="addIdentifier($event)"
          @remove:identifier="removeIdentifier($event)"
        />
      </template>
      <template v-slot:right>
        <Output :data="identifiers"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
