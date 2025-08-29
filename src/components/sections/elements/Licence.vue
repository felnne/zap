<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch, onMounted } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import type { AccessRestriction, DropdownItem, Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'
import { getLicence, getLicences, getLicencesFiltered, getSetting } from '@/lib/data'
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
    if (filteredLicences.value[0]) {
      selectedLicenceSlug.value = filteredLicences.value[0].slug
    } else {
      throw new Error('No licence found!')
    }
  }
}

const dependantSections: DropdownItem[] = [{ href: '#access', title: 'Access Restrictions' }]

const licences = getLicences()
if (!licences[0]) {
  throw new Error('No licence found!')
}

const app_assets_base = getSetting('app_assets_base')

let selectedLicenceSlug = ref<string>(licences[0].slug)

let selectedLicence: ComputedRef<Licence> = computed(() => {
  return getLicence(selectedLicenceSlug.value)
})

let filteredLicences: ComputedRef<Licence[]> = computed(() => {
  const open = props.accessRestriction.restriction === 'unrestricted'
  return getLicencesFiltered(open)
})

let image: ComputedRef<string | undefined> = computed(() => {
  let mode: 'img_dark' | 'img_light' = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'img_dark'
    : 'img_light'
  if (!selectedLicence.value[mode]) return undefined
  return `${app_assets_base}/${selectedLicence.value[mode]}`
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
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="5.2"
      anchor="licence"
      title="Licence"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#licence"
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
        <div class="space-y-4">
          <img id="licence-img" :src="image" height="48px" />
          <Output :data="licenceConstraint"></Output>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
