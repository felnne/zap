import { describe, it, expect } from 'vitest'

import type { Projection, WellKnownExtent } from '@/types/app'
import { createExtent, createProjection } from '@/lib/extents'

describe('createExtent', () => {
  it('creates ISO extent from app extent', () => {
    const extent: WellKnownExtent = {
      slug: 'antarctica',
      name: 'Antarctica',
      projectionSlug: 'epsg_3031',
      extent: {
        geographic: {
          west: -180,
          east: 180,
          south: -90,
          north: -60,
        },
      },
    }
    const identifier = 'bounding'
    const expectedExtent = {
      identifier: identifier,
      geographic: extent.extent.geographic,
    }

    expect(createExtent(extent, identifier)).toStrictEqual(expectedExtent)
  })
})

describe('createProjection', () => {
  it('creates ISO reference system info from app projection', () => {
    const projection: Projection = {
      slug: 'epsg_3031',
      authority: {},
      code: {},
      version: '0',
    }
    const expectedProjection = {
      authority: {},
      code: {},
      version: '0',
    }

    expect(createProjection(projection)).toStrictEqual(expectedProjection)
  })
})
