<script setup lang="ts">
import { UploadSource } from '@/types/enum'

import Button from '@/components/bases/Button.vue'

const emit = defineEmits<{
  'update:source': [id: UploadSource]
}>()

const setSource = (type: UploadSource) => {
  emit('update:source', type)
}
</script>

<template>
  <div class="flex grow space-x-2">
    <Button id="upload-file" @click="setSource(UploadSource.File)">Local File</Button>
  </div>
</template>
