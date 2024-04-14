<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

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
  Lineage as IsoLineage,
  PointOfContact as IsoContact,
  Record as IsoRecord,
} from '@/types/iso'
import { emptyRecord, emptyIsoRecord } from '@/lib/record'
import { showSection } from '@/lib/control'

import Abstract from '@/components/sections/elements/Abstract.vue'
import Access from '@/components/sections/elements/Access.vue'
import Citation from '@/components/sections/elements/Citation.vue'
import Contacts from '@/components/sections/elements/Contacts.vue'
import Dates from '@/components/sections/elements/Dates.vue'
import Downloads from '@/components/sections/elements/Downloads.vue'
import Edition from '@/components/sections/elements/Edition.vue'
import FileIdentifier from '@/components/sections/elements/FileIdentifier.vue'
import GeographicExtent from '@/components/sections/elements/GeographicExtent.vue'
import Identifiers from '@/components/sections/elements/Identifiers.vue'
import Licence from '@/components/sections/elements/Licence.vue'
import Lineage from '@/components/sections/elements/Lineage.vue'
import ResearchTopics from '@/components/sections/elements/ResearchTopics.vue'
import ResourceType from '@/components/sections/elements/ResourceType.vue'
import Services from '@/components/sections/elements/Services.vue'
import Title from '@/components/sections/elements/Title.vue'

defineProps({
  esriToken: {
    type: Object as () => EsriToken,
  },
})

const emit = defineEmits<{
  'update:isoRecord': [id: IsoRecord]
}>()

const record = ref<Record>(emptyRecord)

const isoRecord = ref<IsoRecord>(emptyIsoRecord)

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

const lineageStatement = ref<string>('')
let lineage: ComputedRef<IsoLineage | undefined> = computed(() => {
  if (lineageStatement.value == '') {
    return undefined
  }

  return {
    statement: lineageStatement.value,
  }
})

const distributionOptionsDownloads = ref<IsoDistributionOption[]>([])
const distributionOptionsServices = ref<IsoDistributionOption[]>([])
let distributionOptions: ComputedRef<IsoDistributionOption[]> = computed(() => {
  return [...distributionOptionsDownloads.value, ...distributionOptionsServices.value]
})

let isoRecordMerged: ComputedRef<IsoRecord> = computed(() => {
  let mergedRecord = isoRecord.value

  // merge isoRecord and constraints at 'isoRecord.identification.constraints' if not empty
  if (constraints.value.length > 0) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        constraints: constraints.value,
      },
    }
  }

  // merge isoRecord and distribution at 'isoRecord.distribution' if not empty
  if (distributionOptions.value.length > 0) {
    mergedRecord = {
      ...mergedRecord,
      distribution: distributionOptions.value,
    }
  }

  // merge isoRecord and lineage at 'isoRecord.identification.lineage' if not undefined
  if (lineage.value) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        lineage: lineage.value,
      },
    }
  }

  return mergedRecord
})

const show = (section: string): boolean => showSection(section, record.value.resourceType)

watch(
  () => isoRecordMerged.value,
  () => {
    emit('update:isoRecord', isoRecordMerged.value)
  },
  { deep: true }
)
</script>

<template>
  <section class="space-y-4">
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
      @update:isoKeywords="(event: IsoKeywordSet[]) => (isoRecord.identification.keywords = event)"
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
      @update:iso-lineage-statement="(event: string) => (lineageStatement = event)"
    />
  </section>
</template>
