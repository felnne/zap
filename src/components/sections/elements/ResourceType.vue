<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { ResourceType, Stability } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:resourceType': [id: ResourceType]
  'update:isoHierarchyLevel': [id: string]
}>()

const resourceType = ref<ResourceType>(ResourceType.Dataset)

onMounted(() => {
  emit('update:resourceType', resourceType.value)
  emit('update:isoHierarchyLevel', resourceType.value)
})

watch(
  () => resourceType.value,
  () => {
    emit('update:resourceType', resourceType.value)
    emit('update:isoHierarchyLevel', resourceType.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="2.2"
      :stability="Stability.Stable"
      anchor="resource-type"
      title="Resource Type"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <FormLabel v-for="type in ResourceType" :key="type">
            <input
              :id="'resource-type-' + type"
              v-model="resourceType"
              type="radio"
              name="resource-type"
              :value="type"
            />
            {{ type }}
          </FormLabel>
        </div>
      </template>
      <template #right>
        <Output :data="resourceType"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
