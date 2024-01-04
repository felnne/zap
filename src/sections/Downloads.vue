<script setup lang="ts">
import { ref } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'

import SectionTitle from '@/components/SectionTitle.vue'
import Download from '@/sections/Download.vue'
import Button from '@/components/Button.vue'

let count = ref(0)
</script>
<template>
  <SectionBorder class="space-y-4">
    <SectionTitle anchor="downloads" title="Downloads" />
    <div class="space-y-4">
      <Download v-for="index in count" :key="index"></Download>
    </div>
    <Button id="add-download" @click="count++"> Add Download </Button>
  </SectionBorder>
</template>
