import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import type { Licence } from '@/types/app'
import { doiPossible } from '@/lib/identifiers'

describe('getPublisherSlug', () => {
  const openLicence: Licence = {
    slug: 'x',
    name: 'x',
    open: true,
    url: 'x',
    statement: 'x',
  }

  const closedLicence: Licence = {
    slug: 'x',
    name: 'x',
    open: false,
    url: 'x',
    statement: 'x',
  }

  it('returns PDC for open datasets', () => {
    expect(doiPossible(ResourceType.Dataset, openLicence)).toBeTruthy()
  })

  it('returns MAGIC for closed datasets', () => {
    expect(doiPossible(ResourceType.Dataset, closedLicence)).not.toBeTruthy()
  })

  it('returns MAGIC for open products', () => {
    expect(doiPossible(ResourceType.Product, openLicence)).not.toBeTruthy()
  })

  it('returns MAGIC for closed products', () => {
    expect(doiPossible(ResourceType.Product, closedLicence)).not.toBeTruthy()
  })
})
