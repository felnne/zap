<script setup lang="ts">
import { Stability } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
</script>

<template>
  <SectionBorder class="border-sky-500">
    <SectionTitle
      version="2.0"
      :stability="Stability.Stable"
      anchor="toc"
      title="Elements"
      :add-toc="false"
    />
    <div id="toc-items" class="grid grid-cols-4 gap-4">
      <!-- Items are teleported into this element from the SectionTitle component. -->
    </div>
  </SectionBorder>
</template>
