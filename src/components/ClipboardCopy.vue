<script setup lang="ts">
defineProps({
  data: null as any
})
</script>

<template>
  <button
    class="py-1 px-2 text-xs font-medium border bg-white hover:bg-gray-100 text-gray-800 border-gray-400 shadow"
    :key="data"
    v-clipboard="data"
  >
    Copy
  </button>
</template>
