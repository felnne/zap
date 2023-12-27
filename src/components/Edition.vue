<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Output from './Output.vue'

const emit = defineEmits(['update:edition'])

const edition = ref<string>('1.0')

onMounted(() => {
  emit('update:edition', edition.value)
})

watch(
  () => edition.value,
  () => {
    emit('update:edition', edition.value)
  }
)
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="edition" title="Edition" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <input
          class="flex-grow bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
          type="text"
          name="edition"
          id="edition"
          v-model="edition"
        />
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="edition"></Output>
      </div>
    </div>
  </section>
</template>
