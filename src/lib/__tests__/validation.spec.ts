import { describe, it, expect } from 'vitest'

import { validateRecordText } from '@/lib/validation'
import { minimalRecordAsText, supportedRecordAsText } from '@/lib/__tests__/_validation_data'

describe('validateRecordText', () => {
  it('returns empty error list with minimal valid data', () => {
    expect(validateRecordText(minimalRecordAsText)).toHaveLength(0)
  })

  it('returns empty error list with supported valid data', () => {
    expect(validateRecordText(supportedRecordAsText)).toHaveLength(0)
  })

  it('raises error with empty string', () => {
    const input = ''

    expect(() => validateRecordText(input)).toThrow('Cannot parse input as JSON.')
  })

  it('raises error with erroneous string', () => {
    const input = '//invalid//'

    expect(() => validateRecordText(input)).toThrow('Cannot parse input as JSON.')
  })

  it('returns error list with minimal invalid data (invalid hierarchy_level value)', () => {
    const input = minimalRecordAsText.replace('dataset', 'invalid')

    const expectedError = {
      instancePath: '/hierarchy_level',
      schemaPath: '#/definitions/hierarchy_level/enum',
      keyword: 'enum',
      params: {
        allowedValues: [
          'aggregate',
          'application',
          'attribute',
          'attributeType',
          'collection',
          'collectionHardware',
          'collectionSession',
          'dataset',
          'dimensionGroup',
          'document',
          'feature',
          'featureType',
          'fieldSession',
          'initiative',
          'metadata',
          'model',
          'nonGeographicDataset',
          'product',
          'propertyType',
          'repository',
          'sample',
          'series',
          'service',
          'software',
          'tile',
        ],
      },
      message: 'must be equal to one of the allowed values',
    }

    const errors = validateRecordText(input)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toEqual(expectedError)
  })
})
