<script setup lang="ts">
defineProps({
  borderColourClass: {
    type: String,
    required: false,
    default: 'border-neutral-300 dark:border-neutral-700'
  }
})
</script>
<template>
  <section class="p-2 border-2" :class="borderColourClass"><slot></slot></section>
</template>
