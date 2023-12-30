<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '../types/iso'

import FormLabel from '../components/FormLabel.vue'
import FormInput from '../components/FormInput.vue'

const account = 'bas'

const emit = defineEmits(['add:identifier', 'remove:identifier'])

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
    identifier: `${id.value}`,
    href: `https://${account}.maps.arcgis.com/home/item.html?id=${id.value}`,
    title: `${account}.maps.arcgis.com`
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
  <div class="space-x-2">
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
  </div>
</template>
