<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

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
  Constraint as IsoConstraint,
  Dates as IsoDates,
  DistributionOption as IsoDistributionOption,
  Extent as IsoExtent,
  Identifier,
  KeywordSet as IsoKeywordSet,
  PointOfContact as IsoContact,
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

const accessConstraint = ref<IsoConstraint | null>(null)
const licenceConstraint = ref<IsoConstraint | null>(null)
let constraints: ComputedRef<IsoConstraint[]> = computed(() => {
  // property needed because constraints are null on init
  const _: IsoConstraint[] = []

  if (accessConstraint.value) {
    _.push(accessConstraint.value)
  }
  if (licenceConstraint.value) {
    _.push(licenceConstraint.value)
  }

  return _
})

const distributionOptionsDownloads = ref<IsoDistributionOption[]>([])
const distributionOptionsServices = ref<IsoDistributionOption[]>([])
let distributionOptions: ComputedRef<IsoDistributionOption[]> = computed(() => {
  return [...distributionOptionsDownloads.value, ...distributionOptionsServices.value]
})

const minimalIsoRecord: IsoRecord = {
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
}
const isoRecord = ref<IsoRecord>(minimalIsoRecord)
let isoRecordMerged: ComputedRef<IsoRecord> = computed(() => {
  // merge isoRecord and constraints at 'isoRecord.identification.constraints'
  // merge isoRecord and distribution at 'isoRecord.distribution'
  return {
    ...isoRecord.value,
    identification: {
      ...isoRecord.value.identification,
      constraints: constraints.value,
    },
    distribution: distributionOptions.value,
  }
})

const show = (section: string): boolean => showSection(section, record.value.resourceType)
</script>

<template>
  <main class="bg-white p-10 font-sans text-black dark:bg-black dark:text-white">
    <BackToTop />
    <AppTitle />
    <div class="space-y-4">
      <Prologue />
      <ExternalServices @update:esriToken="(event: EsriToken) => (esriToken = event)" />
      <TableOfContents />
      <FileIdentifier
        @update:fileIdentifier="(event: string) => (record.fileIdentifier = event)"
        @update:isoFileIdentifier="(event: string) => (isoRecord.file_identifier = event)"
      />
      <ResourceType
        @update:resourceType="(event: ResourceTypeEM) => (record.resourceType = event)"
        @update:isoHierarchyLevel="(event: string) => (isoRecord.hierarchy_level = event)"
      />
      <Identifiers
        :file-identifier="record.fileIdentifier"
        :resource-type="record.resourceType"
        :licence="record.licence"
        @update:identifiers="(event: Identifier[]) => (record.identifiers = event)"
        @update:isoIdentifiers="
          (event: Identifier[]) => (isoRecord.identification.identifiers = event)
        "
      />
      <Edition
        @update:edition="(event: string) => (record.edition = event)"
        @update:isoEdition="(event: string) => (isoRecord.identification.edition = event)"
      />
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
        @update:contacts="(event: IsoContact[]) => (record.contacts = event)"
        @update:iso-contacts="(event: IsoContact[]) => (isoRecord.identification.contacts = event)"
      />
      <Access
        v-if="show('access')"
        @update:access="(event: AccessRestriction) => (record.accessRestriction = event)"
        @update:isoAccess="(event: IsoConstraint) => (accessConstraint = event)"
      />
      <Licence
        v-if="show('licence')"
        :access-restriction="record.accessRestriction"
        @update:licence="(event: LicenceT) => (record.licence = event)"
        @update:isoLicence="(event: IsoConstraint) => (licenceConstraint = event)"
      />
      <ResearchTopics
        v-if="show('researchTopics')"
        @update:isoKeywords="
          (event: IsoKeywordSet[]) => (isoRecord.identification.keywords = event)
        "
        @update:isoTopics="(event: string[]) => (isoRecord.identification.topics = event)"
      />
      <Citation
        v-if="show('citation')"
        :record="record"
        @update:isoOtherCitationDetails="
          (event: string) => (isoRecord.identification.other_citation_details = event)
        "
      />
      <Downloads
        v-if="show('downloads')"
        :file-identifier="record.fileIdentifier"
        :resource-type="record.resourceType"
        :licence="record.licence"
        @update:isoDistOptionsDownloads="
          (event: IsoDistributionOption[]) => (distributionOptionsDownloads = event)
        "
      />
      <Services
        v-if="show('services')"
        @update:isoDistOptionsServices="
          (event: IsoDistributionOption[]) => (distributionOptionsServices = event)
        "
      />
      <Lineage
        v-if="show('lineage')"
        @update:iso-lineage="(event: string) => (isoRecord.identification.lineage = event)"
      />
      <Resources />
      <RecordValidation :current-record="isoRecordMerged" />
      <Ideas />
      <Epilogue :app-env="getAppEnvironment()" />
    </div>
  </main>
</template>
