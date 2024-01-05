<script setup lang="ts">
import { getServiceSlugs } from '@/utils/data'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Service from '@/sections/Service.vue'

const serviceSlugs = getServiceSlugs()
</script>
<template>
  <SectionBorder>
    <SectionTitle anchor="services" title="Services" />
    <div class="space-y-4">
      <Service v-for="slug in serviceSlugs" v-bind:key="slug" :slug="slug" />
    </div>
  </SectionBorder>
</template>
