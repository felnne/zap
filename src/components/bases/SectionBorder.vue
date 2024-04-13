<script setup lang="ts">
defineProps({
  borderColourClass: {
    type: String,
    required: false,
    default: 'border-neutral-500',
  },
})
</script>
<template>
  <section class="border-4 p-4" :class="borderColourClass"><slot></slot></section>
</template>
