<script setup lang="ts">
const model = defineModel() as unknown as string | number | undefined
</script>

<template>
  <textarea
    class="bg-white dark:bg-gray-800 border border-black dark:border-white text-black dark:text-white"
    v-model="model"
  ></textarea>
</template>
