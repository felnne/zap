<script setup lang="ts">
import { computed, type ComputedRef, onMounted, type PropType } from 'vue'

import type { EsriToken, WellKnownExtent } from '@/types/app'
import { getSetting } from '@/utils/data'
import { initExtentGlobe, loadCssTheme, parseToken } from '@/utils/esri'

const props = defineProps({
  wke: {
    type: Object as PropType<WellKnownExtent>,
    required: true,
  },
})

const container = 'geographic-extent-globe'

let loginUrl: ComputedRef<string> = computed(() => {
  const clientId = getSetting('agol_app_client_id')
  const redirectUri = 'http://localhost:5173'

  return `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${clientId}&response_type=token&expiration=20160&redirect_uri=${redirectUri}`
})

let token: ComputedRef<EsriToken> = computed(() => {
  return parseToken(window.location.hash)
})

onMounted(() => {
  loadCssTheme()
  initExtentGlobe(container, props.wke, token.value)
})
</script>

<template>
  <div class="h-96 w-full border border-sky-500" :id="container"></div>
  <div class="mt-4 border-2 border-red-500 p-4">
    <p class="text-lg text-red-700">Temporary. Only works locally (hard-coded redirected URL)</p>
    <a :href="loginUrl">Sign In</a>
    <pre>{{ token }}</pre>
  </div>
</template>
