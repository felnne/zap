<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType, ResourceTypeAlias } from '@/types/enum'

import type { Identifier } from '@/types/iso'
import { getSetting } from '@/lib/data'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'

const props = defineProps({
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
})

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

const urlBase = getSetting('app_catalogue_base')
const namespace = getSetting('app_identifier_namespace_alias')

let selected = ref<boolean>(false)
let alias = ref<string>('')

let prefix: ComputedRef<string> = computed(() => {
  const key = Object.keys(ResourceType).find(
    (k) => ResourceType[k as keyof typeof ResourceType] === props.resourceType
  ) as keyof typeof ResourceTypeAlias
  return ResourceTypeAlias[key]
})

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: `${prefix.value}/${alias.value}`,
    href: `${urlBase}/${prefix.value}/${alias.value}`,
    namespace: namespace,
  }
})

watch(selected, (value) => {
  if (value) {
    create()
  } else {
    remove()
  }
})

watch(alias, () => {
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
        :id="'identifier-alias-selection'"
        v-model="selected"
        type="checkbox"
        name="identifiers"
      />
      Alias
    </FormLabel>
    <FormLabel class="text-neutral-500">Value</FormLabel>
    <FormInput
      id="identifier-alias-value"
      v-model="alias"
      type="text"
      name="identifier-alias-value"
      :disabled="!selected"
    />
  </form>
</template>
