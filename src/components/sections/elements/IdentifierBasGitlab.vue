<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { Identifier } from '@/types/iso'
import { getSetting } from '@/lib/data'

import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'

const instance = getSetting('bas_gitlab_domain')

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
let issueUrl = ref<string>('')

let identifier: ComputedRef<Identifier> = computed(() => {
  return {
    identifier: issueUrl.value,
    href: issueUrl.value,
    namespace: instance.replace(/^https?:\/\//, ''),
  }
})

watch(selected, (value) => {
  if (value) {
    create()
  } else {
    remove()
  }
})

watch(issueUrl, () => {
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
        :id="'identifier-bas-gitlab-selection'"
        v-model="selected"
        type="checkbox"
        name="identifiers"
      />
      GitLab (BAS instance)
    </FormLabel>
    <FormLabel class="text-neutral-500">Issue URL</FormLabel>
    <FormInput
      id="identifier-bas-gitlab-id"
      v-model="issueUrl"
      type="text"
      name="identifier-bas-gitlab-id"
      :disabled="!selected"
    />
  </form>
</template>
@/lib/data
