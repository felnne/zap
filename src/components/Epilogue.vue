<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import SectionTitle from './SectionTitle.vue'

let release: ComputedRef<string> = computed(() => {
    return import.meta.env.VITE_BUILD_RELEASE || 'dev'
})

let commit: ComputedRef<string> = computed(() => {
    return import.meta.env.VITE_BUILD_HASH || ''
})

let time: ComputedRef<string> = computed(() => {
    return import.meta.env.VITE_BUILD_TIME || ''
})
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-sky-500">
    <SectionTitle anchor="epilogue" title="Meta" />
    <div class="flex">
      <div class="flex-1 space-y-2">
        <p>
          <a
            class="underline text-blue-600 dark:text-blue-200"
            href="https://gitlab.data.bas.ac.uk/felnne/zap"
            >GitLab project</a
          >.
        </p>
      </div>
      <div class="flex-1 text-right">
        {{ release }} {{ commit }} {{ time }}</div>
    </div>
  </aside>
</template>
