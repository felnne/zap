<script setup lang="ts">
import { DownloadType } from '@/types/enum'

import Button from '@/components/bases/Button.vue'

const emit = defineEmits<{
  'update:type': [id: DownloadType]
}>()

const setType = (type: DownloadType) => {
  emit('update:type', type)
}
</script>

<template>
  <div class="flex flex-grow space-x-2">
    <Button id="download-file" @click="setType(DownloadType.File)">Local File</Button>
    <Button id="download-san" @click="setType(DownloadType.San)">BAS SAN</Button>
  </div>
</template>
