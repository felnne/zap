<script setup lang="ts">
import { computed, type ComputedRef, ref, type PropType, watch } from 'vue'

import { ResourceType, Stability, SectionType } from '@/types/enum'

import type { DistributionOptionIndexed, DropdownItem, Licence } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getFormatExtensions } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Button from '@/components/bases/Button.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Output from '@/components/bases/Output.vue'
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

const add = () => {
  indexCount.value += 1
  indexes.value.push(String(indexCount.value))
}

const update = (option: DistributionOptionIndexed) => {
  distributionOptions.value[option.index] = option.distributionOption
}

const destroy = (index: string) => {
  indexes.value = indexes.value.filter((i) => i !== index)
  delete distributionOptions.value[index]
}

const dependantSections: DropdownItem[] = [
  { href: '#file-identifier', title: 'File Identifier' },
  { href: '#licence', title: 'Licence' },
  { href: '#resource-type', title: 'Resource Type' },
]

const supportedExtensions = getFormatExtensions()

let indexCount = ref<number>(0)
let indexes = ref<string[]>([])
let distributionOptions = ref<Record<string, DistributionOption>>({})

let distributionOptionsCount: ComputedRef<number> = computed(() => {
  return Object.keys(distributionOptions.value).length
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
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="9.2"
      anchor="downloads"
      title="Downloads"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#downloads"
      :data-file-href="['formats.json', 'organisations.json']"
      :depends-on="dependantSections"
    />
    <div class="space-y-4">
      <Download
        v-for="index in indexes"
        :key="index"
        :file-identifier="fileIdentifier"
        :resource-type="resourceType"
        :licence="licence"
        :index="index"
        @update:distribution-option-indexed="(event: DistributionOptionIndexed) => update(event)"
        @destroy="(event: string) => destroy(event)"
      ></Download>
      <div class="flex items-center space-x-2">
        <Button id="add-download" @click="add()"> Add Download </Button>
        <GuidanceText
          >Supported formats:
          <template v-for="(ext, index) in supportedExtensions" :key="ext">
            <code class="bg-orange-50 dark:bg-orange-950">{{ ext }}</code>
            <template v-if="index < supportedExtensions.length - 1">, </template>
          </template>
        </GuidanceText>
        <GuidanceText>Warning: do not upload any restricted files.</GuidanceText>
      </div>
      <Output
        v-if="distributionOptionsCount > 0"
        id="downloads-output"
        :data="Object.values(distributionOptions)"
      />
    </div>
  </SectionBorder>
</template>
