import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  const notForProducts = ['identifierDoi', 'identifierEsri', 'services']
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
