<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import { formatScale } from '@/lib/citation'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormInput from '@/components/bases/FormInput.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'

const emit = defineEmits<{
  'update:isoSpatialResolution': [id: number]
}>()

const scale = ref<number>(0)

let scale_numeric: ComputedRef<number> = computed(() => {
  return Number(scale.value)
})

let scale_fmt: ComputedRef<string> = computed(() => {
  return formatScale(scale.value)
})

watch(
  () => scale.value,
  () => {
    if (scale.value > 0) {
      emit('update:isoSpatialResolution', scale_numeric.value)
    }
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :stability="Stability.Experimental"
      :type="SectionType.Element"
      version="1.1"
      anchor="scale"
      title="Scale"
    />
    <TwoColumn>
      <template #left>
        <div>
          <FormInput id="scale" v-model="scale" type="number" name="scale" class="w-full" />
        </div>
      </template>
      <template #right>
        <div class="space-y-2">
          <Output :data="scale"></Output>
          <GuidanceText>Read as '{{ scale_fmt }}'.</GuidanceText>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
