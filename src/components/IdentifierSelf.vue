<script setup lang="ts">
import { computed, type ComputedRef, onMounted } from 'vue'

import type { Identifier } from '../types/iso'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true
  }
})

const namespace = 'data.bas.ac.uk'
const endpoint = `https://${namespace}/items/`

const emit = defineEmits(['add:identifier'])

let selected = true

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: props.fileIdentifier,
    href: `${endpoint}${props.fileIdentifier}`,
    title: namespace
  }
})

onMounted(() => {
  emit('add:identifier', identifier)
})
</script>

<template>
  <label class="text-black dark:text-white">
    <input
      class="cursor-not-allowed"
      type="checkbox"
      name="identifiers"
      :id="'identifier-self-selection'"
      disabled
      v-model="selected"
    />
    BAS Data Catalogue (<em>required</em>)
  </label>
</template>
