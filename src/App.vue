<script setup lang="ts">
import { ref } from 'vue'

import type { Record } from '@/types/app'

import Abstract from '@/sections/Abstract.vue'
import AppTitle from '@/components/AppTitle.vue'
import BackToTop from '@/components/BackToTop.vue'
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
  resourceType: '',
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
</script>

<template>
  <main class="bg-white dark:bg-black text-black dark:text-white font-sans-serif p-10">
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue />
      <TableOfContents :items="tocItems" />
      <FileIdentifier @update:fileIdentifier="record.fileIdentifier = $event" />
      <ResourceType @update:resourceType="record.resourceType = $event" />
      <Identifiers
        :fileIdentifier="record.fileIdentifier"
        @update:identifiers="record.identifiers = $event"
      />
      <Edition @update:edition="record.edition = $event" />
      <Title @update:title="record.title = $event" />
      <Abstract />
      <Dates @update:dates="record.dates = $event" />
      <GeographicExtent />
      <Contacts @update:contacts="record.contacts = $event" />
      <Licence />
      <Citation
        :resource-type="record.resourceType"
        :identifiers="record.identifiers"
        :edition="record.edition"
        :title="record.title"
        :dates="record.dates"
        :contacts="record.contacts"
      />
      <Downloads />
      <Services />
      <Lineage />
      <Resources />
      <Ideas />
      <Epilogue />
    </div>
  </main>
</template>
