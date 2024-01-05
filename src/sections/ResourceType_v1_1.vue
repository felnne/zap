<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const emit = defineEmits<{
  'update:resourceType': [id: string]
}>()

const resourceTypes = ['dataset', 'product']

const resourceType = ref<string>(resourceTypes[0])

onMounted(() => {
  emit('update:resourceType', resourceType.value)
})

watch(
  () => resourceType.value,
  () => {
    emit('update:resourceType', resourceType.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.1" anchor="resource-type" title="Resource Type" />
    <TwoColumn>
      <template v-slot:left>
        <FormLabel v-for="type in resourceTypes" :key="type">
          <input
            type="radio"
            name="resource-type"
            :id="'resource-type-' + type"
            :value="type"
            v-model="resourceType"
          />
          {{ type }}
        </FormLabel>
      </template>
      <template v-slot:right>
        <Output :data="resourceType"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
