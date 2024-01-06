<script setup lang="ts">
import { getServiceSlugs } from '@/utils/data'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Service from '@/sections/Service_v1_0.vue'

const serviceSlugs = getServiceSlugs()
</script>
<template>
  <SectionBorder>
    <SectionTitle version="1.0" anchor="services" title="Services" />
    <div class="space-y-4">
      <Service v-for="slug in serviceSlugs" v-bind:key="slug" :slug="slug" />
    </div>
  </SectionBorder>
</template>
