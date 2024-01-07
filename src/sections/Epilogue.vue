<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import type { AppEnvironment } from '@/types/app'
import { Stability } from '@/types/enum'
import { getSetting } from '@/utils/data'

import Link from '@/components/Link.vue'
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const props = defineProps({
  appEnv: {
    type: Object as () => AppEnvironment,
    required: true
  }
})

let commitDisplay: ComputedRef<string> = computed(() => {
  if (!props.appEnv.commit) return ''

  return props.appEnv.commit.substring(0, 8)
})

let timeDisplay: ComputedRef<string> = computed(() => {
  if (!props.appEnv.time) return ''

  return props.appEnv.time.replace('T', ' ').replace('+00:00', 'Z')
})
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle version="3" :stability="Stability.Stable" anchor="epilogue" title="Meta" />
    <div class="flex">
      <div class="flex-1 space-y-2">
        <Link :href="getSetting('app_gitlab_url')">GitLab Project</Link>
      </div>
      <div id="app-build-info" class="flex-1 text-right">
        <span title="Build mode">{{ appEnv.mode }}</span>
        <span v-if="appEnv.commit" class="text-neutral-300"> / </span>
        <abbr :title="appEnv.commit"></abbr> {{ commitDisplay }}
        <span v-if="appEnv.time" class="text-neutral-300"> / </span>
        <time :datetime="appEnv.time"></time> {{ timeDisplay }}
      </div>
    </div>
  </SectionBorder>
</template>
