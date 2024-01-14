import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  const notForProducts = ['identifierDoi', 'identifierEsri', 'services']
  const notForCollections = [
    'citation',
    'contacts',
    'downloads',
    'identifierDoi',
    'identifierEsri',
    'access',
    'licence',
    'lineage',
    'services'
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
