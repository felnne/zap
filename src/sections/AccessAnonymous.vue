<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import type { AccessRestriction } from '@/types/app'

import FormLabel from '@/components/FormLabel.vue'

const props = defineProps({
  selectedSlug: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:accessRestriction': [id: AccessRestriction]
}>()

const accessRestriction: AccessRestriction = {
  slug: 'anonymous',
  restriction: 'unrestricted',
  label: 'Open Access (Anonymous)',
  permissions: [],
}

const selected = ref<string>('')

onMounted(() => {
  selected.value = props.selectedSlug
})

watch(
  () => props.selectedSlug,
  () => {
    // Without this, once the input is selected once, it will assume it's always selected, as radio options can't be
    // unselected, only changed.
    selected.value = props.selectedSlug
  }
)

watch(selected, () => {
  if (selected.value !== accessRestriction.slug) return
  emit('update:accessRestriction', accessRestriction)
})
</script>

<template>
  <FormLabel>
    <input
      type="radio"
      name="access-restriction"
      :id="'access-' + accessRestriction.slug"
      :value="accessRestriction.slug"
      v-model="selected"
    />
    {{ accessRestriction.label }}
  </FormLabel>
</template>
