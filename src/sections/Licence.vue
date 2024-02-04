<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch, onMounted } from 'vue'

import { getLicence, getLicences, getLicencesFiltered } from '@/utils/data'
import { createUsageConstraint } from '@/utils/constraints'
import { Stability } from '@/types/enum'
import type { AccessRestriction, Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

import Output from '@/components/Output.vue'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'
import GuidanceText from '@/components/GuidanceText.vue'

const props = defineProps({
  accessRestriction: {
    type: Object as PropType<AccessRestriction>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:licence': [id: Licence]
}>()

const refreshInitialLicence = () => {
  if (!filteredLicences.value.find((licence) => licence.slug === selectedLicenceSlug.value)) {
    selectedLicenceSlug.value = filteredLicences.value[0].slug
  }
}

const licences = getLicences()

let selectedLicenceSlug = ref<string>(licences[0].slug)

let selectedLicence: ComputedRef<Licence> = computed(() => {
  return getLicence(selectedLicenceSlug.value)
})

let filteredLicences: ComputedRef<Licence[]> = computed(() => {
  const open = props.accessRestriction.restriction === 'unrestricted'
  return getLicencesFiltered(open)
})

let licenceConstraint: ComputedRef<Constraint> = computed(() => {
  return createUsageConstraint(selectedLicence.value)
})

onMounted(() => {
  // the initial licence is always the first in the data file, which may not relevant
  refreshInitialLicence()
  emit('update:licence', selectedLicence.value)
})

watch(
  () => props.accessRestriction,
  () => {
    // if currently selected licence is not in the filtered list, select the new first one
    refreshInitialLicence()
  }
)
watch(
  () => selectedLicence.value,
  () => {
    emit('update:licence', selectedLicence.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="4.0" :stability="Stability.Stable" anchor="licence" title="Licence" />
    <TwoColumn>
      <template v-slot:left>
        <div class="space-y-2">
          <FormLabel v-for="licence in filteredLicences" :key="licence.slug">
            <input
              type="radio"
              name="licences"
              :id="'licence-' + licence.slug"
              :value="licence.slug"
              v-model="selectedLicenceSlug"
            />
            {{ licence.name }}
          </FormLabel>
          <GuidanceText>Choices filtered by whether access is open or closed.</GuidanceText>
        </div>
      </template>
      <template v-slot:right>
        <Output :data="licenceConstraint"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
