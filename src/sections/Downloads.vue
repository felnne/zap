<script setup lang="ts">
import { computed, type ComputedRef, ref, type PropType, watch } from 'vue'

import { ResourceType, Stability } from '@/types/enum'
import type { Licence } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getFormatExtensions } from '@/utils/data'
import { getDistributorOrgSlug } from '@/utils/distribution'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Button from '@/components/Button.vue'
import Download from '@/sections/Download.vue'
import GuidanceText from '@/components/GuidanceText.vue'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
  licence: {
    type: Object as PropType<Licence>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:isoDistOptionsDownloads': [id: DistributionOption[]]
}>()

const supportedExtensions = getFormatExtensions()

const distributionOptions = ref<Record<string, DistributionOption>>({})

let count = ref(0)

let disabled: ComputedRef<boolean> = computed(() => {
  // only enable if there is a distributor
  const distributorSlug = getDistributorOrgSlug(props.resourceType, props.licence)
  return distributorSlug === null ? true : false
})

watch(
  () => distributionOptions,
  () => {
    emit('update:isoDistOptionsDownloads', Object.values(distributionOptions.value))
  },
  { deep: true }
)
</script>
<template>
  <SectionBorder class="space-y-4">
    <SectionTitle
      version="5.0"
      :stability="Stability.Experimental"
      anchor="downloads"
      title="Downloads"
    />
    <Download
      v-for="index in count"
      :key="index"
      :file-identifier="fileIdentifier"
      :resource-type="resourceType"
      :licence="licence"
      :index="index"
      @update:iso-distribution-option="
        (event: DistributionOption) => (distributionOptions[index] = event)
      "
    ></Download>
    <div class="flex items-center space-x-2">
      <Button id="add-download" @click="count++" :disabled="disabled"> Add Download </Button>
      <GuidanceText
        >Supported formats:
        <template v-for="(ext, index) in supportedExtensions" v-bind:key="ext">
          <code class="bg-orange-50 dark:bg-orange-950">{{ ext }}</code>
          <template v-if="index < supportedExtensions.length - 1">, </template>
        </template>
      </GuidanceText>
    </div>
  </SectionBorder>
</template>
