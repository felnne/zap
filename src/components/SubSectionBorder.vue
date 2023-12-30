<script setup lang="ts">
defineProps({
  borderColourClass: {
    type: String,
    required: false,
    default: 'border-gray-300 dark:border-gray-700'
  }
})
</script>
<template>
  <section class="p-2 border-2" :class="borderColourClass"><slot></slot></section>
</template>
