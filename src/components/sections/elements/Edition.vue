<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormInput from '@/components/bases/FormInput.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:edition': [id: string]
  'update:isoEdition': [id: string]
}>()

const edition = ref<string>('1.0')

onMounted(() => {
  emit('update:edition', edition.value)
  emit('update:isoEdition', edition.value)
})

watch(
  () => edition.value,
  () => {
    emit('update:edition', edition.value)
    emit('update:isoEdition', edition.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.2" anchor="edition" title="Edition" />
    <TwoColumn>
      <template #left>
        <div>
          <FormInput id="edition" v-model="edition" type="text" name="edition" class="w-full" />
        </div>
      </template>
      <template #right>
        <Output :data="edition"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
