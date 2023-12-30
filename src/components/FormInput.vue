<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input
    class="flex-grow bg-white dark:bg-black border border-black dark:border-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
    v-model="model"
  />
</template>
