<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '../types/iso'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true
  }
})

const prefix = '10.5285'

const emit = defineEmits(['add:identifier', 'remove:identifier'])

const create = () => {
  emit('add:identifier', identifier)
}

const remove = () => {
  emit('remove:identifier', identifier)
}

let selected = ref<boolean>(false)

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: `doi:${prefix}/${props.fileIdentifier}`,
    href: `https://doi.org/${prefix}/${props.fileIdentifier}`,
    title: 'doi'
  }
})

watch(selected, (value) => {
  if (value) {
    create()
  } else {
    remove()
  }
})
</script>

<template>
  <label class="text-black dark:text-white">
    <input type="checkbox" name="identifiers" :id="'identifier-doi-selection'" v-model="selected" />
    DOI (NERC prefix)
  </label>
</template>
