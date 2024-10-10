<script setup lang="ts">
import { computed, type ComputedRef, onBeforeUnmount, ref, watch } from 'vue'

import type { Identifier } from '@/types/iso'
import { getSetting } from '@/lib/data'

import FormLabel from '@/components/bases/FormLabel.vue'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true,
  },
})

const prefix = getSetting('pdc_doi_prefix')

const emit = defineEmits<{
  'add:identifier': [id: Identifier]
  'remove:identifier': [id: Identifier]
}>()

const create = () => {
  emit('add:identifier', identifier.value)
}

const remove = () => {
  emit('remove:identifier', identifier.value)
}

let selected = ref<boolean>(false)

let identifier: ComputedRef<Identifier> = computed(() => {
  const doi = `${prefix}/${props.fileIdentifier}`

  return {
    identifier: doi,
    href: `https://doi.org/${doi}`,
    namespace: 'doi',
  }
})

onBeforeUnmount(() => {
  if (selected.value) {
    remove()
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
  <FormLabel>
    <input :id="'identifier-doi-selection'" v-model="selected" type="checkbox" name="identifiers" />
    DOI (NERC prefix)
  </FormLabel>
</template>
@/lib/data
