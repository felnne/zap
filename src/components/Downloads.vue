<script setup lang="ts">
import { ref } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Download from './Download.vue'

let count = ref(0)
</script>
<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="downloads" title="Downloads" />
    <button @click="count++">Add Download</button>
    <Download v-for="index in count" :key="index"></Download>
  </section>
</template>
