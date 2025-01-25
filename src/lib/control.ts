import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  /*
   * Determine whether a given section should be shown based on the resource type
   *
   * Collections for example only hold other records and so don't have downloads.
   */
  const notForDatasets: string[] = ['collections', 'series', 'size']
  const notForProducts: string[] = ['services']
  const notForCollections: string[] = [
    'access',
    'citation',
    'collections',
    'contacts',
    'downloads',
    'extent-spatial',
    'extent-temporal',
    'identifierDoi',
    'licence',
    'lineage',
    'scale',
    'series',
    'services',
  ]

  if (resourceType == ResourceType.Collection) {
    return !notForCollections.includes(section)
  }

  if (resourceType == ResourceType.Dataset) {
    return !notForDatasets.includes(section)
  }

  if (resourceType == ResourceType.Product) {
    return !notForProducts.includes(section)
  }

  return false
}
