<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch, onMounted } from 'vue'

import { Stability } from '@/types/enum'
import type { AccessRestriction, DropdownItem, Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'
import { getLicence, getLicences, getLicencesFiltered } from '@/lib/data'
import { createUsageConstraint } from '@/lib/constraints'

import Output from '@/components/bases/Output.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'

const props = defineProps({
  accessRestriction: {
    type: Object as PropType<AccessRestriction>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:licence': [id: Licence]
  'update:isoLicence': [id: Constraint]
}>()

const refreshInitialLicence = () => {
  if (!filteredLicences.value.find((licence) => licence.slug === selectedLicenceSlug.value)) {
    selectedLicenceSlug.value = filteredLicences.value[0].slug
  }
}

const dependantSections: DropdownItem[] = [{ href: '#access', title: 'Access Restrictions' }]

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
  // the initial licence is always the first in the data file, which may not be relevant
  refreshInitialLicence()
  emit('update:licence', selectedLicence.value)
  emit('update:isoLicence', licenceConstraint.value)
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
    emit('update:isoLicence', licenceConstraint.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="4.2"
      :stability="Stability.Stable"
      anchor="licence"
      title="Licence"
      :data-file-href="['licences.json']"
      :depends-on="dependantSections"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <FormLabel v-for="licence in filteredLicences" :key="licence.slug">
            <input
              :id="'licence-' + licence.slug"
              v-model="selectedLicenceSlug"
              type="radio"
              name="licences"
              :value="licence.slug"
            />
            {{ licence.name }}
          </FormLabel>
          <GuidanceText>Choices are filtered by whether access is open or closed.</GuidanceText>
        </div>
      </template>
      <template #right>
        <Output :data="licenceConstraint"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
@/lib/data@/lib/constraints
