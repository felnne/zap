<script setup lang="ts">
defineProps({
  textColourClass: {
    type: String,
    required: false,
    default: 'text-gray-500'
  }
})
</script>
<template>
  <label class="mb-2" :class="textColourClass"><slot></slot></label>
</template>
