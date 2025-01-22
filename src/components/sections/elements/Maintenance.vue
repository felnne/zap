<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue'

import { Stability, SectionType, ResourceStatus, ResourceUpdateFrequency } from '@/types/enum'
import type { Maintenance as IsoMaintenance } from '@/types/iso'

import Output from '@/components/bases/Output.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import SubSectionTitle from '@/components/bases/SubSectionTitle.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:isoMaintenance': [id: IsoMaintenance]
}>()

let selectedStatus = ref<ResourceStatus>(ResourceStatus.draft)
let selectedFrequency = ref<ResourceUpdateFrequency>(ResourceUpdateFrequency.asNeeded)

let statues = computed(() => {
  // return list of key value pairs
  return Object.entries(ResourceStatus).map(([key, value]) => {
    return { key: key, value: value }
  })
})

let maintenance: ComputedRef<IsoMaintenance> = computed(() => {
  return {
    progress: selectedStatus.value,
    maintenance_frequency: selectedFrequency.value,
  }
})

onMounted(() => {
  emit('update:isoMaintenance', maintenance.value)
})

watch(
  () => maintenance.value,
  () => {
    emit('update:isoMaintenance', maintenance.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="1.0"
      :stability="Stability.Stable"
      anchor="maintenance"
      title="Maintenance (Status)"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-4">
          <section class="space-y-2">
            <SubSectionTitle>Status</SubSectionTitle>
            <FormLabel v-for="status in statues" :key="status.key">
              <input
                :id="'maintenance-status-' + status.key"
                v-model="selectedStatus"
                type="radio"
                name="maintenance-status"
                :value="status.value"
              />
              {{ status.key }}
            </FormLabel>
          </section>
          <section class="space-y-2">
            <SubSectionTitle>Update Frequency</SubSectionTitle>
            <FormLabel v-for="frequency in ResourceUpdateFrequency" :key="frequency">
              <input
                :id="'maintenance-frequency-' + frequency"
                v-model="selectedFrequency"
                type="radio"
                name="maintenance-frequency"
                :value="frequency"
              />
              {{ frequency }}
            </FormLabel>
          </section>
        </div>
      </template>
      <template #right>
        <Output :data="maintenance"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
