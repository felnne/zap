<script setup lang="ts">
import { ref } from 'vue'

import SectionTitle from './SectionTitle.vue'
import Download from './Download.vue'
import Button from './Button.vue'

let count = ref(0)
</script>
<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="downloads" title="Downloads" />
    <div class="space-y-4">
      <Download v-for="index in count" :key="index"></Download>
    </div>
    <Button @click="count++"> Add Download </Button>
  </section>
</template>
