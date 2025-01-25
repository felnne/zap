import { describe, it, expect } from 'vitest'

import type { PhysicalDimensions, SupplementalInformation } from '@/types/app'
import { createSupplementalInfo } from '@/lib/supplemental'

describe('createSupplementalInfo', () => {
  it('returns an empty value if no properties are defined', () => {
    expect(createSupplementalInfo()).toBe(undefined)
  })

  it('returns a value if physical dimensions are defined', () => {
    const dimensions: PhysicalDimensions = { width: 1, height: 2 }
    const expectedInfo: SupplementalInformation = {
      physical_size_width_mm: dimensions.width,
      physical_size_height_mm: dimensions.height,
    }
    const expectedValue = JSON.stringify(expectedInfo)

    expect(createSupplementalInfo(dimensions)).toBe(expectedValue)
  })
})
