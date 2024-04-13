<script setup lang="ts">
import { ref } from 'vue'

import { getAppEnvironment } from '@/lib/env'
import type { EsriToken } from '@/types/app'
import type { Record as IsoRecord } from '@/types/iso'
import { emptyMinimalRecord } from '@/lib/record'

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
const currentIsoRecord = ref<IsoRecord>(emptyMinimalRecord)
</script>

<template>
  <main class="bg-white p-10 font-sans text-black dark:bg-black dark:text-white">
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
      <Epilogue :app-env="getAppEnvironment()" />
    </div>
  </main>
</template>
