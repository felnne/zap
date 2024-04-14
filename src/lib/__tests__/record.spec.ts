import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import { emptyRecord, emptyIsoRecord } from '@/lib/record'

describe('emptyRecord', () => {
  it('returns an empty app record', () => {
    // expect emptyRecord to be an object
    expect(typeof emptyRecord).toBe('object')

    // expect resourceType to be a value in ResourceType enum
    expect(Object.values(ResourceType).includes(emptyRecord.resourceType)).toBe(true)
  })
})

describe('emptyIsoRecord', () => {
  it('returns an empty ISO record', () => {
    // expect emptyIsoRecord to be an object
    expect(typeof emptyIsoRecord).toBe('object')

    // expect to have hard coded meta values
    expect(emptyIsoRecord.metadata.language).toBe('eng')
  })
})
