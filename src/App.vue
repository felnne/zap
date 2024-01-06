<script setup lang="ts">
import { ref } from 'vue'

import { showSection } from '@/utils/control'
import { ResourceType as ResourceTypeEM } from '@/types/enum'
import type { DateImpreciseLabelled, Record } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'

import AppTitle from '@/components/AppTitle.vue'
import BackToTop from '@/components/BackToTop.vue'

import Abstract from '@/sections/Abstract_v1_0.vue'
import Citation from '@/sections/Citation_v2_0.vue'
import Contacts from '@/sections/Contacts_v1_1.vue'
import Dates from '@/sections/Dates_v1_1.vue'
import Downloads from '@/sections/Downloads_v1_0.vue'
import Edition from '@/sections/Edition_v1_1.vue'
import Epilogue from '@/sections/Epilogue_v1_0.vue'
import FileIdentifier from '@/sections/FileIdentifier_v1_1.vue'
import GeographicExtent from '@/sections/GeographicExtent_v1_0.vue'
import Ideas from '@/sections/Ideas_v1_0.vue'
import Identifiers from '@/sections/Identifiers_v3_0.vue'
import Licence from '@/sections/Licence_v1_0.vue'
import Lineage from '@/sections/Lineage_v1_0.vue'
import Prologue from '@/sections/Prologue_v1_0.vue'
import Resources from '@/sections/Resources_v1_0.vue'
import ResourceType from '@/sections/ResourceType_v2_0.vue'
import Services from '@/sections/Services_v1_0.vue'
import TableOfContents from '@/sections/TableOfContents_v1_0.vue'
import Title from '@/sections/Title_v1_1.vue'
import type { TocItem } from '@/types/app'

const record = ref<Record>({
  fileIdentifier: '',
  resourceType: ResourceTypeEM.Dataset,
  identifiers: [],
  edition: '',
  title: '',
  dates: [],
  contacts: []
})

const tocItems: TocItem[] = [
  { anchor: 'file-identifier', title: 'File identifier' },
  { anchor: 'resource-type', title: 'Resource type' },
  { anchor: 'identifiers', title: 'Identifiers' },
  { anchor: 'edition', title: 'Edition' },
  { anchor: 'title', title: 'Title' },
  { anchor: 'abstract', title: 'Abstract' },
  { anchor: 'dates', title: 'Dates' },
  { anchor: 'spatial-extent', title: 'Spatial extent' },
  { anchor: 'contacts', title: 'Contacts' },
  { anchor: 'citation', title: 'Citation' },
  { anchor: 'licence', title: 'Licence' },
  { anchor: 'downloads', title: 'Downloads' },
  { anchor: 'services', title: 'Services' },
  { anchor: 'lineage', title: 'Lineage' }
]

function show(section: string): boolean {
  return showSection(section, record.value.resourceType)
}
</script>

<template>
  <main class="bg-white dark:bg-black text-black dark:text-white font-sans-serif p-10">
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue />
      <TableOfContents :items="tocItems" />
      <FileIdentifier @update:fileIdentifier="(event: string) => (record.fileIdentifier = event)" />
      <ResourceType
        @update:resourceType="(event: ResourceTypeEM) => (record.resourceType = event)"
      />
      <Identifiers
        :fileIdentifier="record.fileIdentifier"
        :resourceType="record.resourceType"
        @update:identifiers="(event: Identifier[]) => (record.identifiers = event)"
      />
      <Edition @update:edition="(event: string) => (record.edition = event)" />
      <Title @update:title="(event: string) => (record.title = event)" />
      <Abstract />
      <Dates @update:dates="(event: DateImpreciseLabelled[]) => (record.dates = event)" />
      <GeographicExtent />
      <Contacts
        v-if="show('contacts')"
        @update:contacts="(event: Contact[]) => (record.contacts = event)"
      />
      <Licence v-if="show('licence')" />
      <Citation v-if="show('citation')" :record="record" />
      <Downloads v-if="show('downloads')" />
      <Services v-if="show('services')" />
      <Lineage v-if="show('lineage')" />
      <Resources />
      <Ideas />
      <Epilogue />
    </div>
  </main>
</template>
