<script setup lang="ts">
import { ref } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Download from './Download.vue'

let count = ref(0)
</script>
<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="downloads" title="Downloads" />
    <div class="space-y-4">
      <Download v-for="index in count" :key="index"></Download>
    </div>
    <button
      class="py-1 px-2 text-xs font-medium border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-400 shadow"
      @click="count++"
    >
      Add Download
    </button>
  </section>
</template>
