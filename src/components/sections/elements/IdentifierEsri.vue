<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '@/types/iso'
import { getSetting } from '@/lib/data'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'

const account = getSetting('bas_esri_agol_slug')

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
let id = ref<string>('')

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: id.value,
    href: `https://${account}.maps.arcgis.com/home/item.html?id=${id.value}`,
    namespace: `${account}.maps.arcgis.com`,
  }
})

watch(selected, (value) => {
  if (value) {
    create()
  } else {
    remove()
  }
})

watch(id, () => {
  if (selected.value) {
    // update identifier value by recreating it
    // (this isn't very efficient when the user is typing but normally the value will be copy/pasted)
    remove()
    create()
  }
})
</script>

<template>
  <form class="flex space-x-4">
    <FormLabel>
      <input
        type="checkbox"
        name="identifiers"
        :id="'identifier-esri-selection'"
        v-model="selected"
      />
      Esri (BAS AGOL account)
    </FormLabel>
    <FormLabel class="text-neutral-500">Item ID</FormLabel>
    <FormInput
      type="text"
      name="identifier-esri-id"
      id="identifier-esri-id"
      :disabled="!selected"
      v-model="id"
    />
  </form>
</template>
@/lib/data
