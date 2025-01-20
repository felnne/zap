import { describe, it, expect } from 'vitest'

import { AggregationAssociation, AggregationInitiative } from '@/types/enum'
import type { Collection } from '@/types/app'
import type { Aggregation } from '@/types/iso'
import { createAggregation, createItemCollectionAggregation } from '@/lib/aggregations'

describe('createAggregation', () => {
  it('creates an aggregation with minimal properties', () => {
    const identifier = '123'
    const association = AggregationAssociation.largerWorkCitation
    const expectedAggregation: Aggregation = {
      association_type: association,
      identifier: {
        identifier: identifier,
        href: `https://data.bas.ac.uk/items/${identifier}`,
        namespace: 'data.bas.ac.uk',
      },
    }

    expect(createAggregation(identifier, association)).toStrictEqual(expectedAggregation)
  })

  it('creates an aggregation with all properties', () => {
    const identifier = '123'
    const association = AggregationAssociation.largerWorkCitation
    const initiative = AggregationInitiative.collection
    const expectedAggregation: Aggregation = {
      association_type: association,
      initiative_type: initiative,
      identifier: {
        identifier: identifier,
        href: `https://data.bas.ac.uk/items/${identifier}`,
        namespace: 'data.bas.ac.uk',
      },
    }

    expect(createAggregation(identifier, association, initiative)).toStrictEqual(
      expectedAggregation
    )
  })
})

describe('createItemCollectionAggregation', () => {
  it('creates an aggregation for an item in a collection', () => {
    const collection: Collection = {
      slug: 'collection',
      name: 'Collection',
      identifier: '123',
      href: 'https://data.bas.ac.uk/items/123',
    }
    const expectedAggregation: Aggregation = {
      association_type: AggregationAssociation.largerWorkCitation,
      initiative_type: AggregationInitiative.collection,
      identifier: {
        identifier: collection.identifier,
        href: collection.href,
        namespace: 'data.bas.ac.uk',
      },
    }

    expect(createItemCollectionAggregation(collection)).toStrictEqual(expectedAggregation)
  })
})
