<script setup lang="ts">
const model = defineModel() as unknown as string | number | undefined
</script>

<template>
  <textarea
    v-model="model"
    class="border border-black bg-white dark:border-white dark:bg-black"
  ></textarea>
</template>
