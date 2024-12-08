<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import type { AppEnvironment } from '@/types/app'
import { Stability, SectionType } from '@/types/enum'
import { getSetting } from '@/lib/data'

import Link from '@/components/bases/Link.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'

const props = defineProps({
  appEnv: {
    type: Object as () => AppEnvironment,
    required: true,
  },
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
  <SectionBorder :type="SectionType.Info">
    <SectionTitle
      :type="SectionType.Element"
      version="4.1"
      :stability="Stability.Stable"
      anchor="epilogue"
      title="Meta"
      :add-toc="false"
    />
    <div class="flex">
      <div class="flex-1 space-y-2">
        <Link :href="getSetting('app_gitlab_url')">GitLab Project</Link>
      </div>
      <div id="app-build-info" class="flex-1 text-right">
        <span>{{ appEnv.label }}</span>
        <span v-if="appEnv.commit" class="text-neutral-300"> / </span>
        <abbr :title="appEnv.commit"></abbr> {{ commitDisplay }}
        <span v-if="appEnv.time" class="text-neutral-300"> / </span>
        <time :datetime="appEnv.time"></time> {{ timeDisplay }}
      </div>
    </div>
  </SectionBorder>
</template>
@/lib/data
