<script setup lang="ts">
import { ref } from 'vue'

import type { DateImprecise } from '@/types/app'
import type { PointOfContact as Contact, Identifier } from '@/types/iso'

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

const fileIdentifier = ref<string>('')
const resourceType = ref<string>('')
const identifiers = ref<Identifier[]>([])
const edition = ref<string>('')
const title = ref<string>('')
const dates = ref<DateImprecise[]>([])
const contacts = ref<Contact[]>([])

const tocItems: TocItem[] = [
  { anchor: 'file-identifier', title: 'File identifier' },
  { anchor: 'resource-type', title: 'Resource type' },
  { anchor: 'identifiers', title: 'Identifiers' },
  { anchor: 'edition', title: 'Edition' },
  { anchor: 'title', title: 'Title' },
  { anchor: 'abstract', title: 'Abstract' },
  { anchor: 'dates', title: 'Dates' },
  { anchor: 'geographic-extent', title: 'Spatial extent' },
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
      <FileIdentifier @update:fileIdentifier="fileIdentifier = $event" />
      <ResourceType @update:resourceType="resourceType = $event" />
      <Identifiers :fileIdentifier="fileIdentifier" @update:identifiers="identifiers = $event" />
      <Edition @update:edition="edition = $event" />
      <Title @update:title="title = $event" />
      <Abstract />
      <Dates @update:dates="dates = $event" />
      <GeographicExtent />
      <Contacts @update:contacts="contacts = $event" />
      <Licence />
      <Citation
        :resource-type="resourceType"
        :identifiers="identifiers"
        :edition="edition"
        :title="title"
        :dates="dates"
        :contacts="contacts"
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
