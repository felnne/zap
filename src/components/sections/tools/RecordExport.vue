<script setup lang="ts">
import { Stability, SectionType } from '@/types/enum'

import type { Record as IsoRecord } from '@/types/iso'
import { emptyIsoRecord } from '@/lib/record'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Button from '@/components/bases/Button.vue'

const exportRecord = () => {
  const contents = JSON.stringify(props.currentRecord, null, 2)
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.id = 'download-exported-record'
  a.href = url
  a.download = `zap-record-${props.currentRecord.file_identifier}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const props = defineProps({
  currentRecord: {
    type: Object as () => IsoRecord,
    required: false,
    default: emptyIsoRecord,
  },
})
</script>

<template>
  <SectionBorder :type="SectionType.Tools">
    <SectionTitle
      :type="SectionType.Tools"
      :stability="Stability.Stable"
      version="1.0"
      anchor="export"
      title="Export Record"
      :add-toc="true"
    />
    <div>
      <Button id="export-use-current" @click="exportRecord">Export Record</Button>
    </div>
  </SectionBorder>
</template>
