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
import { createOrgSlugPointOfContact } from '@/lib/contacts'

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
import ResourceType from '@/components/sections/elements/ResourceType.vue'
import Services from '@/components/sections/elements/Services.vue'
import Summary from '@/components/sections/elements/Summary.vue'
import Title from '@/components/sections/elements/Title.vue'

defineProps({
  esriToken: {
    type: Object as () => EsriToken | undefined,
    default: undefined,
  },
})

const emit = defineEmits<{
  'update:isoRecord': [id: IsoRecord]
}>()

const record = ref<Record>(emptyRecord)

const isoRecord = ref<IsoRecord>(emptyIsoRecord)

const authors = ref<IsoContact[]>([])
const magicPoC = createOrgSlugPointOfContact('bas_magic', 'pointOfContact')
let contacts: ComputedRef<IsoContact[]> = computed(() => {
  return [...authors.value, magicPoC]
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

  // merge isoRecord and contacts at 'isoRecord.identification.contacts' if not empty
  if (contacts.value.length > 0) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        contacts: contacts.value,
      },
    }
  }

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
      @update:file-identifier="(event: string) => (record.fileIdentifier = event)"
      @update:iso-file-identifier="(event: string) => (isoRecord.file_identifier = event)"
    />
    <ResourceType
      @update:resource-type="(event: ResourceTypeEM) => (record.resourceType = event)"
      @update:iso-hierarchy-level="(event: string) => (isoRecord.hierarchy_level = event)"
    />
    <Identifiers
      :file-identifier="record.fileIdentifier"
      :resource-type="record.resourceType"
      :licence="record.licence"
      @update:identifiers="(event: Identifier[]) => (record.identifiers = event)"
      @update:iso-identifiers="
        (event: Identifier[]) => (isoRecord.identification.identifiers = event)
      "
    />
    <Edition
      @update:edition="(event: string) => (record.edition = event)"
      @update:iso-edition="(event: string) => (isoRecord.identification.edition = event)"
    />
    <Title
      @update:title="(event: string) => (record.title = event)"
      @update:iso-title-value="(event: string) => (isoRecord.identification.title.value = event)"
    />
    <Abstract
      @update:abstract="(event: string) => (record.abstract = event)"
      @update:iso-abstract="(event: string) => (isoRecord.identification.abstract = event)"
    />
    <Summary
      :abstract="record.abstract"
      @update:iso-purpose="(event: string) => (isoRecord.identification.purpose = event)"
    />
    <Dates
      @update:dates="(event: DateImpreciseLabelled[]) => (record.dates = event)"
      @update:iso-dates="(event: IsoDates) => (isoRecord.identification.dates = event)"
    />
    <GeographicExtent
      :esri-token="esriToken || undefined"
      @update:iso-extent="(event: IsoExtent) => (isoRecord.identification.extents = [event])"
    />
    <Contacts
      v-if="show('contacts')"
      @update:contacts="(event: IsoContact[]) => (record.contacts = event)"
      @update:iso-contacts="(event: IsoContact[]) => (authors = event)"
    />
    <Access
      v-if="show('access')"
      @update:access="(event: AccessRestriction) => (record.accessRestriction = event)"
      @update:iso-access="(event: IsoConstraint) => (accessConstraint = event)"
    />
    <Licence
      v-if="show('licence')"
      :access-restriction="record.accessRestriction"
      @update:licence="(event: LicenceT) => (record.licence = event)"
      @update:iso-licence="(event: IsoConstraint) => (licenceConstraint = event)"
    />
    <Citation
      v-if="show('citation')"
      :record="record"
      @update:iso-other-citation-details="
        (event: string) => (isoRecord.identification.other_citation_details = event)
      "
    />
    <Downloads
      v-if="show('downloads')"
      :file-identifier="record.fileIdentifier"
      :resource-type="record.resourceType"
      :licence="record.licence"
      @update:iso-dist-options-downloads="
        (event: IsoDistributionOption[]) => (distributionOptionsDownloads = event)
      "
    />
    <Services
      v-if="show('services')"
      @update:iso-dist-options-services="
        (event: IsoDistributionOption[]) => (distributionOptionsServices = event)
      "
    />
    <Lineage
      v-if="show('lineage')"
      @update:iso-lineage-statement="(event: string) => (lineageStatement = event)"
    />
  </section>
</template>
