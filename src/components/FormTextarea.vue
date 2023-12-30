<script setup lang="ts">
const model = defineModel() as unknown as string | number | undefined
</script>

<template>
  <textarea
    class="bg-white dark:bg-black border border-black dark:border-white"
    v-model="model"
  ></textarea>
</template>
