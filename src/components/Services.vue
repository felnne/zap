<script setup lang="ts">
import servicesData from '../data/services.json'

import SectionTitle from './SectionTitle.vue'
import Service from './Service.vue'

const serviceSlugs: string[] = Object.keys(servicesData.services).sort((a: string, b: string) =>
  a.localeCompare(b)
)
</script>
<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="services" title="Services" />
    <Service v-for="slug in serviceSlugs" v-bind:key="slug" :slug="slug" />
  </section>
</template>
