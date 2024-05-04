<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'

import { ResourceType, Stability } from '@/types/enum'
import type { Licence } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getFormatExtensions } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Button from '@/components/bases/Button.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Download from '@/components/sections/elements/Download.vue'

defineProps({
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
      version="7.0"
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
      <Button id="add-download" @click="count++"> Add Download </Button>
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
@/lib/data@/lib/distribution
