<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { PhysicalDimensions, PhysicalSize } from '@/types/app'
import { Stability, SectionType } from '@/types/enum'
import { getPhysicalSizes } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import FormInput from '@/components/bases/FormInput.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'

const emit = defineEmits<{
  'update:dimensions': [id: PhysicalDimensions]
}>()

const sizes = getPhysicalSizes()

let width = ref<number>(0)
let height = ref<number>(0)
let selectedSlug = ref<string | undefined>(undefined)

let size: ComputedRef<PhysicalSize | undefined> = computed(() => {
  if (!selectedSlug.value || selectedSlug.value === 'custom') {
    return undefined
  }
  return sizes.find((s) => s.slug === selectedSlug.value)
})

let customSize: ComputedRef<PhysicalDimensions> = computed(() => {
  return {
    width: width.value,
    height: height.value,
  }
})

let dimensions: ComputedRef<PhysicalDimensions> = computed(() => {
  if (size.value) {
    return { width: size.value.width_mm, height: size.value.height_mm }
  }
  return customSize.value
})

watch(size, () => {
  if (size.value) {
    width.value = size.value.width_mm
    height.value = size.value.height_mm
  }
})

watch(dimensions, async () => {
  emit('update:dimensions', dimensions.value)
})
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="1.1"
      anchor="physical-size"
      title="Physical size"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#physical-size"
      :data-file-href="['physical_sizes.json']"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-4">
          <div class="space-y-2">
            <FormLabel v-for="aSize in sizes" :key="aSize.slug">
              <input
                :id="`size-${aSize.slug}`"
                v-model="selectedSlug"
                type="radio"
                name="sizes"
                :value="aSize.slug"
              />
              {{ aSize.name }}
            </FormLabel>
            <FormLabel>
              <input
                id="size-custom"
                v-model="selectedSlug"
                type="radio"
                name="sizes"
                value="custom"
              />
              Custom size
            </FormLabel>
          </div>
          <div v-if="selectedSlug == 'custom'" class="space-y-4">
            <div class="space-y-2">
              <FormLabel>Width (mm)</FormLabel>
              <FormInput id="size-width" v-model="width" type="number" name="size-width" />
            </div>
            <div class="space-y-2">
              <FormLabel>Height</FormLabel>
              <FormInput id="size-height" v-model="height" type="number" name="size-height" />
            </div>
          </div>
        </div>
      </template>
      <template #right>
        <div class="space-y-2">
          <Output v-if="dimensions" id="dimensions" :data="dimensions"></Output>
          <GuidanceText
            >Dimensions are encoded within the supplemetal information element.</GuidanceText
          >
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
