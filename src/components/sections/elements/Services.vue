<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { DistributionOption } from '@/types/iso'
import { getServiceSlugs } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Service from '@/components/sections/elements/Service.vue'

const emit = defineEmits<{
  'update:isoDistOptionsServices': [id: DistributionOption[]]
}>()

const serviceSlugs = getServiceSlugs()

const distributionOptions = ref<Record<string, DistributionOption>>({})

watch(
  () => distributionOptions,
  () => {
    emit('update:isoDistOptionsServices', Object.values(distributionOptions.value))
  },
  { deep: true }
)
</script>
<template>
  <SectionBorder>
    <SectionTitle
      version="4.1"
      :stability="Stability.Stable"
      anchor="services"
      title="Services"
      :data-file-href="['formats.json', 'organisations.json', 'services.json']"
    />
    <div class="space-y-4">
      <Service
        v-for="slug in serviceSlugs"
        :key="slug"
        :slug="slug"
        @update:iso-distribution-option="
          (event: DistributionOption) => (distributionOptions[slug] = event)
        "
        @update:selected="
          (event: boolean) => {
            if (!event) {
              delete distributionOptions[slug]
            }
          }
        "
      />
    </div>
  </SectionBorder>
</template>
@/lib/data
