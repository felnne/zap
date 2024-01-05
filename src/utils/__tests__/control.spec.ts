import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import { showSection } from '@/utils/control'

describe('showSection', () => {
  it('shows all sections for datasets', () => {
    expect(showSection('citation', ResourceType.Dataset)).toBeTruthy()
  })

  it('shows relevant sections for products', () => {
    expect(showSection('citation', ResourceType.Product)).toBeTruthy()
    expect(showSection('services', ResourceType.Product)).not.toBeTruthy()
  })

  it('shows relevant sections for collections', () => {
    expect(showSection('citation', ResourceType.Collection)).not.toBeTruthy()
  })
})
