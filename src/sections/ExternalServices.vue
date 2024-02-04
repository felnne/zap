<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { EsriToken } from '@/types/app'
import {
  getSignInUrl as getAgolSignInUrl,
  detectCallbackUrl as detectAgolCallbackUrl,
  parseCallbackUrl as parseAgolCallbackUrl,
} from '@/utils/esriAuth'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import GuidanceText from '@/components/GuidanceText.vue'
import Output from '@/components/Output.vue'
import Link from '@/components/Link.vue'

const processCallback = () => {
  if (!detectAgolCallbackUrl(window.location.hash)) {
    return null
  }

  agolToken.value = parseAgolCallbackUrl(window.location.hash)
  window.location.hash = ''
}

const emit = defineEmits<{
  'update:esriToken': [id: EsriToken]
}>()

const agolToken = ref<EsriToken | null>(null)

const agolSignInUrl = getAgolSignInUrl()

onMounted(() => {
  processCallback()
})

watch(
  () => agolToken.value,
  () => {
    if (agolToken.value) {
      emit('update:esriToken', agolToken.value)
    }
  }
)
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle
      version="1.0"
      :stability="Stability.Experimental"
      anchor="external-services"
      title="External Services"
      sub-title="ArcGIS Online"
      :add-toc="false"
    />
    <div class="space-y-4">
      <GuidanceText
        >Needed to access restricted feature service for the 3D extent preview.</GuidanceText
      >
      <div v-if="!agolToken">
        <Link id="external-sign-in-agol" :href="agolSignInUrl" :force-internal="true">Sign In</Link>
      </div>
      <Output
        v-if="agolToken"
        id="external-token-agol"
        :data="agolToken"
        :enable-copy="false"
      ></Output>
    </div>
  </SectionBorder>
</template>
