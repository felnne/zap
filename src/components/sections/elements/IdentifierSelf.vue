<script setup lang="ts">
import { computed, type ComputedRef, watch } from 'vue'

import type { Identifier } from '@/types/iso'

import FormLabel from '@/components/bases/FormLabel.vue'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const namespace = 'data.bas.ac.uk'
const endpoint = `https://${namespace}/items/`

const emit = defineEmits<{
  'add:identifier': [id: Identifier]
  'remove:identifier': [id: Identifier]
}>()

let selected = true

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: props.fileIdentifier,
    href: `${endpoint}${props.fileIdentifier}`,
    namespace: namespace,
  }
})

watch(
  () => props.fileIdentifier,
  () => {
    emit('add:identifier', identifier.value)
  }
)
</script>

<template>
  <FormLabel>
    <input
      :id="'identifier-self-selection'"
      v-model="selected"
      class="cursor-not-allowed"
      type="checkbox"
      name="identifiers"
      disabled
    />
    BAS Data Catalogue (<em>required</em>)
  </FormLabel>
</template>
