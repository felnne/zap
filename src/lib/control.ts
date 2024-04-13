import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  /*
   * Determine whether a given section should be shown based on the resource type
   *
   * Collections for example only hold other records and so don't have downloads.
   */
  const notForProducts = ['services']
  const notForCollections = [
    'access',
    'citation',
    'contacts',
    'downloads',
    'identifierDoi',
    'identifierEsri',
    'licence',
    'lineage',
    'researchTopics',
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
