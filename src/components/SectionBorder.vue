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
  <section class="p-4 border-4" :class="borderColourClass"><slot></slot></section>
</template>
