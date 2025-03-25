<script setup lang="ts">
import { Stability, SectionType } from '@/types/enum'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Button from '@/components/bases/Button.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'

const emit = defineEmits<{
  'update:isoAbstract': [id: string]
  'update:isoTitleValue': [id: string]
  'update:isoLineageStatement': [id: string]
}>()

const title = 'x'
const abstract = 'xx'
const lineage = 'xxx'

const setRequired = () => {
  emit('update:isoAbstract', abstract)
  emit('update:isoTitleValue', title)
  emit('update:isoLineageStatement', lineage)
}
</script>

<template>
  <SectionBorder :type="SectionType.Tools">
    <SectionTitle
      :type="SectionType.Tools"
      :stability="Stability.Experimental"
      version="1.0"
      anchor="sample"
      title="Sample Data"
      :add-toc="true"
    />
    <div class="space-y-2">
      <div>
        <Button id="set-sample-required" @click="setRequired">Populate required sections</Button>
      </div>
      <GuidanceText>This only updates the underlying record, not the UI.</GuidanceText>
    </div>
  </SectionBorder>
</template>
