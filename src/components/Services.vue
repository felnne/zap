<script setup lang="ts">
import servicesData from '../data/services.json'

import SectionBorder from './SectionBorder.vue'
import SectionTitle from './SectionTitle.vue'
import Service from './Service.vue'

const serviceSlugs: string[] = Object.keys(servicesData.services).sort((a: string, b: string) =>
  a.localeCompare(b)
)
</script>
<template>
  <SectionBorder>
    <SectionTitle anchor="services" title="Services" />
    <div class="space-y-4">
      <Service v-for="slug in serviceSlugs" v-bind:key="slug" :slug="slug" />
    </div>
  </SectionBorder>
</template>
