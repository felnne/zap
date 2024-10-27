<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('overflow-hidden')
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-orange-500 text-9xl font-bold text-white"
    style="margin-top: 0 !important"
  >
    It's metadata time! 🤩
  </div>
</template>
