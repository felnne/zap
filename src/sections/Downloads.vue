<script setup lang="ts">
import { computed, type ComputedRef, ref, type PropType } from 'vue'

import { ResourceType, Stability } from '@/types/enum'
import type { Licence } from '@/types/app'
import { getFormatExtensions } from '@/utils/data'
import { getDistributorOrgSlug } from '@/utils/distribution'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Button from '@/components/Button.vue'
import Download from '@/sections/Download.vue'
import GuidanceText from '@/components/GuidanceText.vue'

const props = defineProps({
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
  licence: {
    type: Object as PropType<Licence>,
    required: true,
  },
})

const supportedExtensions = getFormatExtensions()

let count = ref(0)

let disabled: ComputedRef<boolean> = computed(() => {
  // only enable if there is a distributor
  const distributorSlug = getDistributorOrgSlug(props.resourceType, props.licence)
  return distributorSlug === null ? true : false
})
</script>
<template>
  <SectionBorder class="space-y-4">
    <SectionTitle
      version="3.0"
      :stability="Stability.Stable"
      anchor="downloads"
      title="Downloads"
    />
    <Download
      v-for="index in count"
      :key="index"
      :resource-type="resourceType"
      :licence="licence"
      :index="index"
    ></Download>
    <div class="flex items-center space-x-2">
      <Button id="add-download" @click="count++" :disabled="disabled"> Add Download </Button>
      <GuidanceText
        >Supported formats:
        <template v-for="(ext, index) in supportedExtensions" v-bind:key="ext">
          <code class="bg-emerald-50 dark:bg-emerald-950">{{ ext }}</code>
          <template v-if="index < supportedExtensions.length - 1">, </template>
        </template>
      </GuidanceText>
    </div>
  </SectionBorder>
</template>
