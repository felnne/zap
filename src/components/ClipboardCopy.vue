<script setup lang="ts">
defineProps({
  data: null as any
})
</script>

<template>
  <button :key="data" v-clipboard="data">Copy</button>
</template>
