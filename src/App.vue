<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

import { getAppEnvironment, getAppBorderClasses } from '@/lib/env'
import type { EsriToken } from '@/types/app'
import type { Record as IsoRecord } from '@/types/iso'
import { emptyIsoRecord } from '@/lib/record'

import Loading from '@/components/static/Loading.vue'
import AppTitle from '@/components/static/AppTitle.vue'
import BackToTop from '@/components/static/BackToTop.vue'
import Epilogue from '@/components/sections/info/Epilogue.vue'
import ExternalServices from '@/components/sections/tools/ExternalServices.vue'
import Ideas from '@/components/sections/info/Ideas.vue'
import Prologue from '@/components/sections/info/Prologue.vue'
import RecordValidation from '@/components/sections/tools/RecordValidation.vue'
import RecordExport from '@/components/sections/tools/RecordExport.vue'
import Resources from '@/components/sections/info/Resources.vue'
import TableOfContents from '@/components/sections/info/TableOfContents.vue'

const esriToken = ref<EsriToken | undefined>(undefined)
const currentIsoRecord = ref<IsoRecord>(emptyIsoRecord)
const appEnvironment = getAppEnvironment(window.location.pathname)
const envBorderColour = getAppBorderClasses(appEnvironment)

// Define asynchronously to prevent blocking main content
const Record = defineAsyncComponent({
  loader: () => import('@/components/compositions/Record.vue'),
  loadingComponent: Loading,
})
</script>

<template>
  <main
    class="border-8 bg-white p-4 font-sans text-black dark:bg-black dark:text-white"
    :class="envBorderColour"
  >
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue :app-env="appEnvironment" />
      <ExternalServices @update:esri-token="(event: EsriToken) => (esriToken = event)" />
      <TableOfContents />
      <Record
        :app-env="appEnvironment"
        :esri-token="esriToken"
        @update:iso-record="(event: IsoRecord) => (currentIsoRecord = event)"
      />
      <Resources />
      <RecordValidation :current-record="currentIsoRecord" />
      <RecordExport :current-record="currentIsoRecord" />
      <Ideas />
      <Epilogue :app-env="appEnvironment" />
    </div>
  </main>
</template>
