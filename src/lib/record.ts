import { ResourceType } from '@/types/enum'
import type { Record } from '@/types/app'
import type { Record as IsoRecord } from '@/types/iso'
import { getDomainConsistency } from '@/lib/data'
import { createOrgSlugPointOfContact } from '@/lib/contacts'

export const emptyRecord: Record = {
  fileIdentifier: '',
  resourceType: ResourceType.Dataset,
  identifiers: [],
  edition: '',
  title: '',
  abstract: '',
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
}

export const emptyIsoRecord: IsoRecord = {
  /*
   * A ISO 19115-2 (v3) record with required properties set to initial (null) values.
   *
   * This record will not validate until values or items for these properties are set.
   * It is intended to be used as the initial value in reactive properties and to set a consistent properties order.
   *
   * Some properties are not included as they may not be included in all records.
   */
  $schema:
    'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json', // required
  file_identifier: '', // required (profile), default/auto-generated value set
  hierarchy_level: '', // required (profile), default/auto-generated value set
  metadata: {
    character_set: 'utf8', // recommended (guidance), hard-coded
    language: 'eng', // recommended (guidance), hard-coded
    contacts: [
      createOrgSlugPointOfContact('bas_magic', 'pointOfContact'), // required (ISO), hard-coded (profile required value)
    ],
    date_stamp: new Date().toISOString().split('T')[0], // required (ISO), default/auto-generated value set
  },
  identification: {
    title: {
      value: '', // required (ISO)
    },
    abstract: '', // required (ISO)
    // purpose: '', // may not be set
    dates: {}, // required (ISO), default/auto-generated value set
    edition: '', // required (profile), default/auto-generated value set
    other_citation_details: '', // typically set
    identifiers: [], // required (profile), default/auto-generated value set
    contacts: [], // required (profile)
    maintenance: {
      maintenance_frequency: 'asNeeded', // required (profile), temporarily hard-coded value
      progress: 'completed', // required (profile), temporarily hard-coded value
    },
    constraints: [], // required (profile), default/auto-generated value set
    character_set: 'utf8', // recommended (guidance) , hard-coded
    language: 'eng', // required (ISO), hard-coded
    extents: [], // required (profile)
    // lineage: {'statement': ''},  // conditional (profile), if not a collection
    domain_consistency: [getDomainConsistency('magic_discovery_v1')], // required (profile), hard-coded (profile required value)
  },
  // distribution: [],  // may not be set
}
