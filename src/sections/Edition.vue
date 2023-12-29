<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Output from '../components/Output.vue'
import FormInput from '../components/FormInput.vue'

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
    <SectionTitle anchor="edition" title="Edition" />
    <div class="flex">
      <form class="w-1/2 pr-2 flex flex-col">
        <FormInput type="text" name="edition" id="edition" v-model="edition" />
      </form>
      <div class="w-1/2 pl-2 flex flex-col">
        <Output :data="edition"></Output>
      </div>
    </div>
  </SectionBorder>
</template>
