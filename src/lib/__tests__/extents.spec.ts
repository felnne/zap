import { describe, it, expect } from 'vitest'

import type { Projection, WellKnownExtent } from '@/types/app'
import type { TemporalExtent } from '@/types/iso'
import { createExtent, createProjection } from '@/lib/extents'

const geographicExtent: WellKnownExtent = {
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

describe('createExtent', () => {
  it('creates ISO extent with geographic component', () => {
    const expectedExtent = {
      identifier: identifier,
      geographic: geographicExtent.extent.geographic,
    }

    expect(createExtent(identifier, geographicExtent.extent.geographic)).toStrictEqual(
      expectedExtent
    )
  })

  it('creates ISO extent with geographic and temporal components', () => {
    const temporalExtent: TemporalExtent = {
      period: {
        start: '2000-01-01',
        end: '2022-01-01',
      },
    }
    const expectedExtent = {
      identifier: identifier,
      geographic: geographicExtent.extent.geographic,
      temporal: temporalExtent,
    }

    expect(
      createExtent(identifier, geographicExtent.extent.geographic, temporalExtent)
    ).toStrictEqual(expectedExtent)
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
