<script setup lang="ts">
import { ref } from 'vue'

import { getAppEnvironment, getAppBorderClasses } from '@/lib/env'
import type { EsriToken } from '@/types/app'
import type { Record as IsoRecord } from '@/types/iso'
import { emptyIsoRecord } from '@/lib/record'

import AppTitle from '@/components/bases/AppTitle.vue'
import BackToTop from '@/components/bases/BackToTop.vue'
import Epilogue from '@/components/sections/info/Epilogue.vue'
import ExternalServices from '@/components/sections/info/ExternalServices.vue'
import Ideas from '@/components/sections/info/Ideas.vue'
import Prologue from '@/components/sections/info/Prologue.vue'
import Record from '@/components/compositions/Record.vue'
import RecordValidation from '@/components/sections/info/RecordValidation.vue'
import Resources from '@/components/sections/info/Resources.vue'
import TableOfContents from '@/components/sections/info/TableOfContents.vue'

const esriToken = ref<EsriToken | undefined>(undefined)
const currentIsoRecord = ref<IsoRecord>(emptyIsoRecord)
const appEnvironment = getAppEnvironment(window.location.pathname)
const envBorderColour = getAppBorderClasses(appEnvironment)
</script>

<template>
  <main
    class="border-8 bg-white p-4 font-sans text-black dark:bg-black dark:text-white"
    :class="envBorderColour"
  >
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue />
      <ExternalServices @update:esriToken="(event: EsriToken) => (esriToken = event)" />
      <TableOfContents />
      <Record
        :esri-token="esriToken"
        @update:iso-record="(event: IsoRecord) => (currentIsoRecord = event)"
      />
      <Resources />
      <RecordValidation :current-record="currentIsoRecord" />
      <Ideas />
      <Epilogue :app-env="appEnvironment" />
    </div>
  </main>
</template>
