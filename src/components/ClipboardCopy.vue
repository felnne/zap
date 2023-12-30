<script setup lang="ts">
import Button from '@/components/Button.vue'

defineProps({
  data: null as any
})
</script>

<template>
  <Button :key="data" v-clipboard="data">Copy</Button>
</template>
