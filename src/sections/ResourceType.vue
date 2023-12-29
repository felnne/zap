<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Output from '../components/Output.vue'
import FormLabel from '../components/FormLabel.vue'

const emit = defineEmits(['update:resourceType'])

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
    <SectionTitle anchor="resource-type" title="Resource Type" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
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
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="resourceType"></Output>
      </div>
    </div>
  </SectionBorder>
</template>
