<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import Link from '@/components/Link.vue'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'

let release: ComputedRef<string> = computed(() => {
  return import.meta.env.VITE_BUILD_RELEASE || 'dev'
})

let commit: ComputedRef<string> = computed(() => {
  return import.meta.env.VITE_BUILD_HASH || ''
})

let time: ComputedRef<string> = computed(() => {
  return import.meta.env.VITE_BUILD_TIME || ''
})

let commitDisplay: ComputedRef<string> = computed(() => {
  return commit.value.substring(0, 7)
})

let timeDisplay: ComputedRef<string> = computed(() => {
  return time.value.replace('T', ' ').replace('+00:00', 'Z')
})
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle anchor="epilogue" title="Meta" />
    <div class="flex">
      <div class="flex-1 space-y-2">
        <Link href="https://gitlab.data.bas.ac.uk/felnne/zap">GitLab Project</Link>
      </div>
      <div class="flex-1 text-right">
        {{ release }}
        <span v-if="commit" class="text-neutral-300">/</span>
        <abbr :title="commit"></abbr> {{ commitDisplay }}
        <span v-if="time" class="text-neutral-300">/</span>
        <time :datetime="time"></time> {{ timeDisplay }}
      </div>
    </div>
  </SectionBorder>
</template>
