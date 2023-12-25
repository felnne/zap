<script setup lang="ts">
import { ref } from 'vue'

import Abstract from './components/Abstract.vue'
import AppTitle from './components/AppTitle.vue'
import ChangeLog from './components/ChangeLog.vue'
import Contacts from './components/Contacts.vue'
import Downloads from './components/Downloads.vue'
import FileIdentifier from './components/FileIdentifier.vue'
import GeographicExtent from './components/GeographicExtent.vue'
import Ideas from './components/Ideas.vue'
import Identifiers from './components/Identifiers.vue'
import Licence from './components/Licence.vue'
import Lineage from './components/Lineage.vue'
import Preface from './components/Preface.vue'
import Resources from './components/Resources.vue'
import Services from './components/Services.vue'
import TableOfContents from './components/TableOfContents.vue'
import Title from './components/Title.vue'
import type { TocItem } from './types/app'

const fileIdentifier = ref('')
const tocItems: TocItem[] = [
  { anchor: 'file-identifier', title: 'File identifier' },
  { anchor: 'identifiers', title: 'Identifiers' },
  { anchor: 'title', title: 'Title' },
  { anchor: 'abstract', title: 'Abstract' },
  { anchor: 'geographic-extent', title: 'Spatial extent' },
  { anchor: 'contacts', title: 'Contacts' },
  { anchor: 'licence', title: 'Licence' },
  { anchor: 'downloads', title: 'Downloads' },
  { anchor: 'services', title: 'Services' },
  { anchor: 'lineage', title: 'Lineage' }
]
</script>

<template>
  <main class="font-sans-serif m-10 mt-0">
    <AppTitle />
    <Preface />
    <TableOfContents :items="tocItems" />
    <FileIdentifier @update:fileIdentifier="fileIdentifier = $event" />
    <Identifiers :fileIdentifier="fileIdentifier" />
    <Title />
    <Abstract />
    <GeographicExtent />
    <Contacts />
    <Licence />
    <Downloads />
    <Services />
    <Lineage />
    <Resources />
    <Ideas />
    <ChangeLog />
  </main>
</template>
