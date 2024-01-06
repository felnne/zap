<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '@/types/iso'
import { getSetting } from '@/utils/data'

import FormLabel from '@/components/FormLabel.vue'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true
  }
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
  <div>
    <FormLabel>
      <input
        type="checkbox"
        name="identifiers"
        :id="'identifier-doi-selection'"
        v-model="selected"
      />
      DOI (NERC prefix)
    </FormLabel>
  </div>
</template>
