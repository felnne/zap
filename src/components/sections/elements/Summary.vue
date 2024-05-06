<script setup lang="ts">
import { ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { DropdownItem } from '@/types/app'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import SectionExperimental from '@/components/bases/SectionExperimental.vue'
import Markdown from '@/components/bases/Markdown.vue'

defineProps({
  abstract: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'update:summary': [id: string]
  'update:isoPurpose': [id: string]
}>()

const dependantSections: DropdownItem[] = [{ href: '#access', title: 'Access Restrictions' }]

const summary = ref<string>('')

watch(
  () => summary.value,
  () => {
    emit('update:summary', summary.value)
    emit('update:isoPurpose', summary.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="1.0"
      :stability="Stability.Experimental"
      anchor="summary"
      title="Summary"
      :add-toc="true"
      :depends-on="dependantSections"
    />
    <div class="space-y-4">
      <Markdown input-id="summary-input" @update:input="(event: string) => (summary = event)" />
      <SectionExperimental><p>Coming Soon!</p></SectionExperimental>
    </div>
  </SectionBorder>
</template>
