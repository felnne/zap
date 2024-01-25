import { describe, it, expect } from 'vitest'

import { validateRecordText } from '@/utils/validation'

describe('validateRecordText', () => {
  it('returns empty error list with valid data', () => {
    const record = {
      $schema:
        'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
      hierarchy_level: 'dataset',
      metadata: {
        language: 'eng',
        character_set: 'utf-8',
        contacts: [{ organisation: { name: 'UK Polar Data Centre' }, role: ['pointOfContact'] }],
        date_stamp: '2018-10-18',
      },
      identification: {
        title: { value: 'Test Record' },
        dates: { creation: '2018' },
        abstract:
          'Test Record for ISO 19115 metadata standard (no profile) with required properties only.',
        character_set: 'utf-8',
        language: 'eng',
        topics: ['environment', 'climatologyMeteorologyAtmosphere'],
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
    const input = JSON.stringify(record)

    expect(validateRecordText(input)).toHaveLength(0)
  })

  it('raises error with empty string', () => {
    const input = ''

    expect(() => validateRecordText(input)).toThrow('Cannot parse input as JSON.')
  })
})
