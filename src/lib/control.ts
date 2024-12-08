import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  /*
   * Determine whether a given section should be shown based on the resource type
   *
   * Collections for example only hold other records and so don't have downloads.
   */
  const notForProducts: string[] = ['services']
  const notForCollections: string[] = [
    'access',
    'citation',
    'contacts',
    'downloads',
    'identifierDoi',
    'licence',
    'lineage',
    'services',
  ]

  if (resourceType == ResourceType.Collection) {
    return !notForCollections.includes(section)
  }

  if (resourceType == ResourceType.Dataset) return true

  if (resourceType == ResourceType.Product) {
    return !notForProducts.includes(section)
  }

  return false
}
