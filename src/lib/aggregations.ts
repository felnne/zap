import { AggregationAssociation, AggregationInitiative } from '@/types/enum'
import type { Collection } from '@/types/app'
import type { Aggregation } from '@/types/iso'

export const createAggregation = (
  identifier: string,
  association: AggregationAssociation,
  initiative?: AggregationInitiative
): Aggregation => {
  /* Create an ISO 19115 aggregation from a related identifier value */
  const aggregation: Aggregation = {
    association_type: association,
    identifier: {
      identifier: identifier,
      href: `https://data.bas.ac.uk/items/${identifier}`,
      namespace: 'data.bas.ac.uk',
    },
  }
  if (initiative) {
    aggregation.initiative_type = initiative
  }

  return aggregation
}

export const createItemCollectionAggregation = (collection: Collection): Aggregation => {
  /* Create an aggregation taking an item is part of a related collection (child to parent) */
  return createAggregation(
    collection.identifier,
    AggregationAssociation.largerWorkCitation,
    AggregationInitiative.collection
  )
}
