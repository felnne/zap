<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input
    class="flex-grow border border-black bg-white disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-white dark:bg-black dark:disabled:bg-neutral-700"
    v-model="model"
  />
</template>
