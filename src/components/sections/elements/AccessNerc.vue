<script setup lang="ts">
import { ref, watch } from 'vue'

import type { AccessRestriction } from '@/types/app'
import { getSetting } from '@/lib/data'

import FormLabel from '@/components/bases/FormLabel.vue'

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
  slug: 'nerc',
  restriction: 'restricted',
  label: 'Closed Access (NERC)',
  permissions: [
    {
      scheme: 'ms_graph',
      schemeVersion: '1',
      directoryId: getSetting('nerc_ad_tenant_id'),
      objectId: null,
    },
  ],
}

const selected = ref<string>('')

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
@/lib/data
