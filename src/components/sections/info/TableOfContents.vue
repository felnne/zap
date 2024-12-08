<script setup lang="ts">
import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import SubSectionTitle from '@/components/bases/SubSectionTitle.vue'

const formatTitle = (title: string) => {
  if (title === 'element') return 'Elements'

  return title.charAt(0).toUpperCase() + title.slice(1)
}

const types = ['element', 'info', 'tools']
</script>

<template>
  <SectionBorder :type="SectionType.Info">
    <SectionTitle
      :type="SectionType.Info"
      version="3.0"
      :stability="Stability.Stable"
      anchor="toc"
      title="Contents"
      :add-toc="false"
    />
    <div class="space-y-4">
      <template v-for="type in types" :key="type">
        <SubSectionTitle>{{ formatTitle(type) }}</SubSectionTitle>
        <div :id="`toc-items-${type}`" class="grid grid-cols-4 gap-4">
          <!-- Items are teleported into this element from the SectionTitle component. -->
        </div>
      </template>
    </div>
  </SectionBorder>
</template>
