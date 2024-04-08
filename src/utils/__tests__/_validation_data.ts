import type { Record as IsoRecord } from '@/types/iso'

const minimalRecord: IsoRecord = {
  $schema:
    'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
  hierarchy_level: 'dataset',
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
    date_stamp: '2018-10-18',
  },
  identification: {
    title: { value: 'Test Record' },
    dates: { publication: '2018' },
    abstract:
      'Test Record for ISO 19115 metadata standard (no profile) with required properties only.',
    character_set: 'utf8',
    language: 'eng',
    topics: ['environment'],
    extents: [
      {
        identifier: 'bounding',
        geographic: {
          bounding_box: {
            west_longitude: -45.61521,
            east_longitude: -27.04976,
            south_latitude: -68.1511,
            north_latitude: -54.30761,
          },
        },
      },
    ],
  },
}

export const minimalRecordAsText = (): string => JSON.stringify(minimalRecord)
