<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input
    class="flex-grow bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
    v-model="model"
  />
</template>
