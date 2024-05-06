<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <template v-if="show">
    <slot />
  </template>
  <template v-else>
    <div
      @click="show = true"
      class="app-diagonalstripes-orange-100 flex cursor-pointer items-center justify-center bg-orange-300 p-20"
    >
      <div class="inline-block space-y-4 bg-white bg-opacity-70 p-4 text-center dark:bg-black">
        <p class="text-3xl">Here be dragons 🏴󠁧󠁢󠁷󠁬󠁳󠁿</p>
        <p>This section is super experimental so may not work, at all.</p>
        <p>To probably be disappointed, click anywhere.</p>
      </div>
    </div>
  </template>
</template>
