<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormInput from '@/components/FormInput.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const emit = defineEmits(['update:edition'])

const edition = ref<string>('1.0')

onMounted(() => {
  emit('update:edition', edition.value)
})

watch(
  () => edition.value,
  () => {
    emit('update:edition', edition.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle version="1.0" anchor="edition" title="Edition" />
    <TwoColumn>
      <template v-slot:left>
        <div>
          <FormInput type="text" name="edition" id="edition" v-model="edition" class="w-full" />
        </div>
      </template>
      <template v-slot:right>
        <Output :data="edition"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
