<script setup lang="ts">
import { ref, watch } from 'vue'

import SectionBorder from './SectionBorder.vue'
import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'
import IdentifierSelf from './IdentifierSelf.vue'
import IdentifierDoi from './IdentifierDoi.vue'
import IdentifierEsri from './IdentifierEsri.vue'

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
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
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
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="identifiers"></Output>
      </div>
    </div>
  </SectionBorder>
</template>
