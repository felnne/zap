<script setup lang="ts">
import { ref, type PropType } from 'vue'

import { ResourceType, Stability } from '@/types/enum'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Button from '@/components/Button.vue'
import Download from '@/sections/Download.vue'
import GuidanceText from '@/components/GuidanceText.vue'

defineProps({
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true
  }
})

let count = ref(0)
</script>
<template>
  <SectionBorder class="space-y-4">
    <SectionTitle version="2.0" :stability="Stability.Experimental" anchor="downloads" title="Downloads" />
      <Download v-for="index in count" :key="index" :resource-type="resourceType" :index="index"></Download>
      <div class="space-x-2 flex items-center">
        <Button id="add-download" @click="count++"> Add Download </Button>
        <GuidanceText>Supported formats: PNG, JPEG, PDF, GeoPackages.</GuidanceText>
      </div>

  </SectionBorder>
</template>
