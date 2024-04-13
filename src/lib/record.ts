import type { Record as IsoRecord } from '@/types/iso'

export const emptyMinimalRecord: IsoRecord = {
  /*
   * A ISO 19115-2 (v3) record with all required fields set to empty/null values.
   *
   * This record will not validate until values or items for these fields are set.
   * It is intended to be used as the initial value in reactive properties.
   */
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
