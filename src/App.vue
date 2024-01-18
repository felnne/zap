<script setup lang="ts">
import { ref } from 'vue'

import { getAppEnvironment } from '@/utils/env'
import { showSection } from '@/utils/control'
import { ResourceType as ResourceTypeEM } from '@/types/enum'
import type { AccessRestriction, DateImpreciseLabelled, Record } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'

import AppTitle from '@/components/AppTitle.vue'
import BackToTop from '@/components/BackToTop.vue'

import Abstract from '@/sections/Abstract.vue'
import Access from './sections/Access.vue'
import Citation from '@/sections/Citation.vue'
import Contacts from '@/sections/Contacts.vue'
import Dates from '@/sections/Dates.vue'
import Downloads from '@/sections/Downloads.vue'
import Edition from '@/sections/Edition.vue'
import Epilogue from '@/sections/Epilogue.vue'
import FileIdentifier from '@/sections/FileIdentifier.vue'
import GeographicExtent from '@/sections/GeographicExtent.vue'
import Ideas from '@/sections/Ideas.vue'
import Identifiers from '@/sections/Identifiers.vue'
import Licence from '@/sections/Licence.vue'
import Lineage from '@/sections/Lineage.vue'
import Prologue from '@/sections/Prologue.vue'
import Resources from '@/sections/Resources.vue'
import ResourceType from '@/sections/ResourceType.vue'
import Services from '@/sections/Services.vue'
import TableOfContents from '@/sections/TableOfContents.vue'
import Title from '@/sections/Title.vue'
import type { TocItem } from '@/types/app'

const record = ref<Record>({
  fileIdentifier: '',
  resourceType: ResourceTypeEM.Dataset,
  identifiers: [],
  edition: '',
  title: '',
  dates: [],
  contacts: [],
  accessRestriction: {
    slug: 'unknown',
    restriction: 'restricted',
    label: 'Unknown',
    permissions: [],
  },
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
  { anchor: 'access', title: 'Access' },
  { anchor: 'licence', title: 'Licence' },
  { anchor: 'downloads', title: 'Downloads' },
  { anchor: 'services', title: 'Services' },
  { anchor: 'lineage', title: 'Lineage' },
]

function show(section: string): boolean {
  return showSection(section, record.value.resourceType)
}
</script>

<template>
  <main class="font-sans-serif bg-white p-10 text-black dark:bg-black dark:text-white">
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
      <Access
        v-if="show('access')"
        @update:access="(event: AccessRestriction) => (record.accessRestriction = event)"
      />
      <Licence v-if="show('licence')" :accessRestriction="record.accessRestriction" />
      <Citation v-if="show('citation')" :record="record" />
      <Downloads v-if="show('downloads')" :resourceType="record.resourceType" />
      <Services v-if="show('services')" />
      <Lineage v-if="show('lineage')" />
      <Resources />
      <Ideas />
      <Epilogue :app-env="getAppEnvironment()" />
    </div>
  </main>
</template>
