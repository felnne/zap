<script setup lang="ts">
import { ref } from 'vue'

import { getAppEnvironment } from '@/utils/env'
import { showSection } from '@/utils/control'
import { ResourceType as ResourceTypeEM } from '@/types/enum'
import type {
  AccessRestriction,
  DateImpreciseLabelled,
  EsriToken,
  Licence as LicenceT,
  Record,
} from '@/types/app'
import type {
  Dates as IsoDates,
  Extent as IsoExtent,
  Identifier,
  PointOfContact as Contact,
  Record as IsoRecord,
} from '@/types/iso'

import AppTitle from '@/components/AppTitle.vue'
import BackToTop from '@/components/BackToTop.vue'

import Abstract from '@/sections/Abstract.vue'
import Access from '@/sections/Access.vue'
import Citation from '@/sections/Citation.vue'
import Contacts from '@/sections/Contacts.vue'
import Dates from '@/sections/Dates.vue'
import Downloads from '@/sections/Downloads.vue'
import Edition from '@/sections/Edition.vue'
import Epilogue from '@/sections/Epilogue.vue'
import ExternalServices from './sections/ExternalServices.vue'
import FileIdentifier from '@/sections/FileIdentifier.vue'
import GeographicExtent from '@/sections/GeographicExtent.vue'
import Ideas from '@/sections/Ideas.vue'
import Identifiers from '@/sections/Identifiers.vue'
import Licence from '@/sections/Licence.vue'
import Lineage from '@/sections/Lineage.vue'
import Prologue from '@/sections/Prologue.vue'
import RecordValidation from './sections/RecordValidation.vue'
import ResearchTopics from './sections/ResearchTopics.vue'
import Resources from '@/sections/Resources.vue'
import ResourceType from '@/sections/ResourceType.vue'
import Services from '@/sections/Services.vue'
import TableOfContents from '@/sections/TableOfContents.vue'
import Title from '@/sections/Title.vue'

const esriToken = ref<EsriToken | null>(null)

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
  licence: {
    slug: 'unknown',
    name: 'Unknown',
    url: '',
    statement: '',
    open: false,
  },
})

const isoRecord = ref<IsoRecord>({
  $schema:
    'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
  hierarchy_level: '',
  metadata: {
    language: 'eng',
    character_set: 'utf8',
    contacts: [
      {
        organisation: {
          name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
          href: 'https://ror.org/01rhff309',
          title: 'ror',
        },
        role: ['pointOfContact'],
      },
    ],
    date_stamp: new Date().toISOString().split('T')[0],
  },
  identification: {
    title: {
      value: '',
    },
    dates: {},
    abstract: '',
    language: 'eng',
    character_set: 'utf8',
    topics: [],
    extents: [],
  },
})

function show(section: string): boolean {
  return showSection(section, record.value.resourceType)
}
</script>

<template>
  <main class="bg-white p-10 font-sans text-black dark:bg-black dark:text-white">
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue />
      <ExternalServices @update:esriToken="(event: EsriToken) => (esriToken = event)" />
      <TableOfContents />
      <FileIdentifier @update:fileIdentifier="(event: string) => (record.fileIdentifier = event)" />
      <ResourceType
        @update:resourceType="(event: ResourceTypeEM) => (record.resourceType = event)"
        @update:isoHierarchyLevel="(event: string) => (isoRecord.hierarchy_level = event)"
      />
      <Identifiers
        :file-identifier="record.fileIdentifier"
        :resource-type="record.resourceType"
        :licence="record.licence"
        @update:identifiers="(event: Identifier[]) => (record.identifiers = event)"
      />
      <Edition @update:edition="(event: string) => (record.edition = event)" />
      <Title
        @update:title="(event: string) => (record.title = event)"
        @update:isoTitleValue="(event: string) => (isoRecord.identification.title.value = event)"
      />
      <Abstract
        @update:isoAbstract="(event: string) => (isoRecord.identification.abstract = event)"
      />
      <Dates
        @update:dates="(event: DateImpreciseLabelled[]) => (record.dates = event)"
        @update:isoDates="(event: IsoDates) => (isoRecord.identification.dates = event)"
      />
      <GeographicExtent
        :esri-token="esriToken || undefined"
        @update:isoExtent="(event: IsoExtent) => (isoRecord.identification.extents = [event])"
      />
      <Contacts
        v-if="show('contacts')"
        @update:contacts="(event: Contact[]) => (record.contacts = event)"
      />
      <Access
        v-if="show('access')"
        @update:access="(event: AccessRestriction) => (record.accessRestriction = event)"
      />
      <Licence
        v-if="show('licence')"
        :access-restriction="record.accessRestriction"
        @update:licence="(event: LicenceT) => (record.licence = event)"
      />
      <ResearchTopics
        v-if="show('researchTopics')"
        @update:isoTopics="(event: string[]) => (isoRecord.identification.topics = event)"
      />
      <Citation v-if="show('citation')" :record="record" />
      <Downloads
        v-if="show('downloads')"
        :file-identifier="record.fileIdentifier"
        :resource-type="record.resourceType"
        :licence="record.licence"
      />
      <Services v-if="show('services')" />
      <Lineage v-if="show('lineage')" />
      <Resources />
      <RecordValidation :output-record="isoRecord" />
      <Ideas />
      <Epilogue :app-env="getAppEnvironment()" />
    </div>
  </main>
</template>
