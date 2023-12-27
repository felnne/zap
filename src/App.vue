<script setup lang="ts">
import { ref } from 'vue'

import type { DateImprecise } from './types/app'
import type { PointOfContact as Contact, Identifier } from './types/iso'

import Abstract from './components/Abstract.vue'
import AppTitle from './components/AppTitle.vue'
import Citation from './components/Citation.vue'
import Contacts from './components/Contacts.vue'
import Dates from './components/Dates.vue'
import Downloads from './components/Downloads.vue'
import Edition from './components/Edition.vue'
import Epilogue from './components/Epilogue.vue'
import FileIdentifier from './components/FileIdentifier.vue'
import GeographicExtent from './components/GeographicExtent.vue'
import Ideas from './components/Ideas.vue'
import Identifiers from './components/Identifiers.vue'
import Licence from './components/Licence.vue'
import Lineage from './components/Lineage.vue'
import Prologue from './components/Prologue.vue'
import Resources from './components/Resources.vue'
import ResourceType from './components/ResourceType.vue'
import Services from './components/Services.vue'
import TableOfContents from './components/TableOfContents.vue'
import Title from './components/Title.vue'
import type { TocItem } from './types/app'

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
  <main class="bg-white dark:bg-gray-800 font-sans-serif p-10 mt-0">
    <AppTitle />
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
  </main>
</template>
