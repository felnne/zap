<script setup lang="ts">
defineProps({
  borderColourClass: {
    type: String,
    required: false,
    default: 'border-gray-500'
  }
})
</script>
<template>
  <section class="mb-5 p-5 border-4" :class="borderColourClass"><slot></slot></section>
</template>
