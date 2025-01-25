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
  collections: [],
}

export const emptyIsoRecord: IsoRecord = {
  /*
   * A ISO 19115-2 (v4) record with required properties set to initially empty ('') values.
   *
   * This record will not validate against the record schema until properties are updated.
   * It is intended to pass type checks when used as an initial value in reactive properties, and to set a consistent
   * property order.
   */
  $schema:
    'https://metadata-resources.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v4.json', // required
  file_identifier: '', // required (profile), default/auto-generated value set
  hierarchy_level: '', // required (profile), default/auto-generated value set
  metadata: {
    character_set: 'utf8', // recommended (guidance), hard-coded
    language: 'eng', // recommended (guidance), hard-coded
    contacts: [
      createOrgSlugPointOfContact('bas_magic', 'pointOfContact'), // required (ISO), hard-coded value (profile)
    ],
    date_stamp: new Date().toISOString().split('T')[0], // required (ISO), default/auto-generated value
  },
  identification: {
    title: {
      value: '', // required (ISO)
    },
    abstract: '', // required (ISO)
    // purpose: '', // optional
    dates: {}, // required: creation (ISO), default/auto-generated value - others conditional (profile) or optional
    edition: '', // required (profile), default/auto-generated value
    // other_citation_details: '', optional
    identifiers: [], // required (profile), default/auto-generated value
    contacts: [], // required (profile)
    maintenance: {
      maintenance_frequency: '', // required (profile)
      progress: '', // required (profile)
    },
    constraints: [], // required (profile), default/auto-generated value
    character_set: 'utf8', // recommended (guidance), value hard-coded
    language: 'eng', // required (ISO), value hard-coded
    extents: [], // required: geographic (profile), optional: temporal
    // lineage: {'statement': ''},  // conditional: if not collection (profile)
    domain_consistency: [getDomainConsistency('magic_discovery_v1')], // required (profile), hard-coded value (profile)
  },
  // distribution: [],  // optional
}
