<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

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
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="resource-type" title="Resource Type" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <label v-for="type in resourceTypes" :key="type" class="text-black dark:text-white">
          <input
            type="radio"
            name="resource-type"
            :id="'resource-type-' + type"
            :value="type"
            v-model="resourceType"
          />
          {{ type }}
        </label>
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="resourceType"></Output>
      </div>
    </div>
  </section>
</template>
