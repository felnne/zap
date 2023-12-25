<script setup lang="ts">
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import SectionTitle from './SectionTitle.vue'
import ClipboardCopy from './ClipboardCopy.vue'

const uuid = uuidv4()

const emit = defineEmits(['update:fileIdentifier'])

onMounted(() => {
  emit('update:fileIdentifier', uuid)
})
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="file-identifier" title="File identifier" />
    <code class="block text-s mb-2">{{ uuid }}</code>
    <ClipboardCopy :data="uuid" />
  </section>
</template>
