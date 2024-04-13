import { describe, it, expect } from 'vitest'

import { emptyMinimalRecord } from '@/lib/record'

describe('_getUniqueItems', () => {
  it('returns a minimal ISO record', () => {
    // expect emptyMinimalRecord to be an object
    expect(typeof emptyMinimalRecord).toBe('object')
  })
})
