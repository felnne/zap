<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '../types/iso'

const account = 'bas'

const emit = defineEmits(['add:identifier', 'remove:identifier'])

const create = () => {
  emit('add:identifier', identifier)
}

const remove = () => {
  emit('remove:identifier', identifier)
}

let selected = ref<boolean>(false)
let id = ref<String>('')

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
    <label class="text-black dark:text-white">
      <input
        type="checkbox"
        name="identifiers"
        :id="'identifier-esri-selection'"
        v-model="selected"
      />
      Esri (BAS AGOL account)
    </label>
    <label class="text-gray-500 dark:text-gray-300">Item ID</label>
    <input
      class="flex-grow bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
      type="text"
      name="identifier-esri-id"
      id="identifier-esri-id"
      :disabled="!selected"
      v-model="id"
    />
  </div>
</template>
