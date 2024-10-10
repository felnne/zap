<script setup lang="ts">
const model = defineModel() as unknown as string | number | undefined
</script>

<template>
  <input
    v-model="model"
    class="flex-grow border border-black bg-white disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-white dark:bg-black dark:disabled:bg-neutral-700"
  />
</template>
