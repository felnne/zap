<script setup lang="ts">
import Button from '@/components/bases/Button.vue'

defineProps({
  data: {
    type: null,
    required: false,
    default: '',
  },
})
</script>

<template>
  <Button :key="data" v-clipboard="data">Copy</Button>
</template>
