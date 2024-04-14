import { ResourceType } from '@/types/enum'
import type { Record } from '@/types/app'
import type { Record as IsoRecord } from '@/types/iso'

export const emptyRecord: Record = {
  fileIdentifier: '',
  resourceType: ResourceType.Dataset,
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
}

export const emptyIsoRecord: IsoRecord = {
  /*
   * A ISO 19115-2 (v3) record with most supported fields set to empty/null values.
   *
   * This record will not validate until values or items for these fields are set.
   * It is intended to be used as the initial value in reactive properties and to set a consistent order for fields.
   *
   * Some fields are not included as they may not be included in all records.
   */
  $schema:
    'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json', // required
  file_identifier: '', // default/auto-generated value set
  hierarchy_level: '', // required, default/auto-generated value set
  metadata: {
    character_set: 'utf8', // required, hard-coded
    language: 'eng', // required, hard-coded
    contacts: [
      // required, hard-coded
      {
        organisation: {
          name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
          href: 'https://ror.org/01rhff309',
          title: 'ror',
        },
        role: ['pointOfContact'],
      },
    ],
    date_stamp: new Date().toISOString().split('T')[0], // required, default/auto-generated value set
  },
  identification: {
    title: {
      value: '', // required
    },
    abstract: '', // required
    dates: {}, // required, default/auto-generated value set
    edition: '', // default/auto-generated value set
    other_citation_details: '', // typically set
    identifiers: [], // default/auto-generated value set
    contacts: [], // typically set
    keywords: [], // typically set, linked to required field
    constraints: [], // default/auto-generated value set
    character_set: 'utf8', // required, hard-coded
    language: 'eng', // required, hard-coded
    topics: [], // required
    extents: [], // required
    // lineage: '',  // may not be set
  },
  // distribution: [],  // may not be set
}
