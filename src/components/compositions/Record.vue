<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { AppEnvironmentLabel, ResourceType as ResourceTypeEM } from '@/types/enum'
import type {
  AccessRestriction,
  AppEnvironment,
  Collection,
  DateImpreciseLabelled,
  Licence as LicenceT,
  PhysicalDimensions,
  Record,
} from '@/types/app'
import type {
  Aggregation as IsoAggregation,
  Constraint as IsoConstraint,
  Dates as IsoDates,
  DistributionOption as IsoDistributionOption,
  Extent as IsoExtent,
  GeographicExtent as IsoGeographicExtent,
  GraphicOverview as IsoGraphicOverview,
  Identifier,
  Lineage as IsoLineage,
  Maintenance as IsoMaintenance,
  PointOfContact as IsoContact,
  TemporalExtent as IsoTemporalExtent,
  Record as IsoRecord,
  Series as IsoSeries,
} from '@/types/iso'
import { createExtent } from '@/lib/extents'
import { emptyRecord, emptyIsoRecord } from '@/lib/record'
import { showSection } from '@/lib/control'
import { createOrgSlugPointOfContact } from '@/lib/contacts'
import { createSupplementalInfo } from '@/lib/supplemental'

import Abstract from '@/components/sections/elements/Abstract.vue'
import Access from '@/components/sections/elements/Access.vue'
import Citation from '@/components/sections/elements/Citation.vue'
import Collections from '@/components/sections/elements/Collections.vue'
import Contacts from '@/components/sections/elements/Contacts.vue'
import Dates from '@/components/sections/elements/Dates.vue'
import Downloads from '@/components/sections/elements/Downloads.vue'
import Edition from '@/components/sections/elements/Edition.vue'
import FileIdentifier from '@/components/sections/elements/FileIdentifier.vue'
import GeographicExtent from '@/components/sections/elements/GeographicExtent.vue'
import Identifiers from '@/components/sections/elements/Identifiers.vue'
import Licence from '@/components/sections/elements/Licence.vue'
import Lineage from '@/components/sections/elements/Lineage.vue'
import Maintenance from '@/components/sections/elements/Maintenance.vue'
import PhysicalSize from '@/components/sections/elements/PhysicalSize.vue'
import RecordSample from '@/components/sections/tools/RecordSample.vue'
import ResourceType from '@/components/sections/elements/ResourceType.vue'
import Scale from '@/components/sections/elements/Scale.vue'
import Series from '@/components/sections/elements/Series.vue'
import Services from '@/components/sections/elements/Services.vue'
import Summary from '@/components/sections/elements/Summary.vue'
import TemporalExtent from '@/components/sections/elements/TemporalExtent.vue'
import Thumbnails from '@/components/sections/elements/Thumbnails.vue'
import Title from '@/components/sections/elements/Title.vue'

defineProps({
  appEnv: {
    type: Object as () => AppEnvironment,
    required: true,
  },
})

const emit = defineEmits<{
  'update:isoRecord': [id: IsoRecord]
}>()

const show = (section: string): boolean => showSection(section, record.value.resourceType)

const setSummary = (summary: string) => {
  if (summary !== '') {
    isoRecord.value.identification.purpose = summary
  } else {
    delete isoRecord.value.identification.purpose
  }
}

const setCitation = (citation: string) => {
  if (citation !== '') {
    isoRecord.value.identification.other_citation_details = citation
  } else {
    delete isoRecord.value.identification.other_citation_details
  }
}

const record = ref<Record>(emptyRecord)
const isoRecord = ref<IsoRecord>(emptyIsoRecord)

const authors = ref<IsoContact[]>([])
const magicPoC = createOrgSlugPointOfContact('bas_magic', 'pointOfContact')
let contacts: ComputedRef<IsoContact[]> = computed(() => {
  return [...authors.value, magicPoC]
})

const thumbnails = ref<IsoGraphicOverview[]>([])
const series = ref<IsoSeries | undefined>(undefined)

const extentIdentifier = 'bounding'
const extentGeographic = ref<IsoGeographicExtent | undefined>(undefined)
const extentTemporal = ref<IsoTemporalExtent | undefined>(undefined)
let extents: ComputedRef<IsoExtent[]> = computed(() => {
  if (!extentGeographic.value) {
    return []
  }
  return [createExtent(extentIdentifier, extentGeographic.value, extentTemporal.value)]
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

const dimensions = ref<PhysicalDimensions | undefined>(undefined)
let supplementalInfo: ComputedRef<string | undefined> = computed(() => {
  return createSupplementalInfo(dimensions.value)
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

  // merge isoRecord and extents at 'isoRecord.identification.extents' if not empty
  if (extents.value.length > 0) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        extents: extents.value,
      },
    }
  }

  // merge isoRecord and thumbnails at 'isoRecord.identification.graphic_overviews' if not empty
  if (thumbnails.value.length > 0) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        graphic_overviews: thumbnails.value,
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

  // merge isoRecord and series at 'isoRecord.identification.series' if not undefined
  if (series.value) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        series: series.value,
      },
    }
  }

  // merge isoRecord and supplementalInfo at 'isoRecord.identification.supplemental_information' if not undefined
  if (supplementalInfo.value) {
    mergedRecord = {
      ...mergedRecord,
      identification: {
        ...mergedRecord.identification,
        supplemental_information: supplementalInfo.value,
      },
    }
  }

  return mergedRecord
})

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
    <Maintenance
      @update:iso-maintenance="
        (event: IsoMaintenance) => (isoRecord.identification.maintenance = event)
      "
    >
    </Maintenance>
    <ResourceType
      @update:resource-type="(event: ResourceTypeEM) => (record.resourceType = event)"
      @update:iso-hierarchy-level="(event: string) => (isoRecord.hierarchy_level = event)"
    />
    <Collections
      v-if="show('collections')"
      @update:collections="(event: Collection[]) => (record.collections = event)"
      @update:iso-aggregations="
        (event: IsoAggregation[]) => (isoRecord.identification.aggregations = event)
      "
    />
    <Series
      v-if="show('series')"
      :edition="record.edition"
      @update:iso-series="(event: IsoSeries | undefined) => (series = event)"
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
      @update:iso-purpose="(event: string) => setSummary(event)"
    />
    <Dates
      @update:dates="(event: DateImpreciseLabelled[]) => (record.dates = event)"
      @update:iso-dates="(event: IsoDates) => (isoRecord.identification.dates = event)"
    />
    <Scale
      v-if="show('scale')"
      @update:iso-spatial-resolution="
        (event: number) => (isoRecord.identification.spatial_resolution = event)
      "
    />
    <GeographicExtent
      @update:iso-extent-geographic="(event: IsoGeographicExtent) => (extentGeographic = event)"
    />
    <TemporalExtent
      @update:iso-extent-temporal="
        (event: IsoTemporalExtent | undefined) => (extentTemporal = event)
      "
    />
    <PhysicalSize
      v-if="show('physical_size')"
      @update:dimensions="(event: PhysicalDimensions) => (dimensions = event)"
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
      @update:iso-other-citation-details="(event: string) => setCitation(event)"
    />
    <Thumbnails
      :file-identifier="record.fileIdentifier"
      @update:iso-graphic-overviews="(event: IsoGraphicOverview[]) => (thumbnails = event)"
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
    <RecordSample
      v-if="appEnv.label == AppEnvironmentLabel.LocalDevelopment"
      @update:iso-abstract="(event: string) => (isoRecord.identification.abstract = event)"
      @update:iso-title-value="(event: string) => (isoRecord.identification.title.value = event)"
      @update:iso-lineage-statement="(event: string) => (lineageStatement = event)"
    />
  </section>
</template>
