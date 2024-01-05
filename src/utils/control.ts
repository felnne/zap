import { ResourceType } from '@/types/enum'

export const showSection = (section: string, resourceType: ResourceType): boolean => {
  const notForProducts = ['identifierDoi', 'identifierEsri', 'services']
  const notForCollections = [
    'citation',
    'contacts',
    'downloads',
    'identifierDoi',
    'identifierEsri',
    'licence',
    'lineage',
    'services'
  ]

  if (resourceType == ResourceType.Collection) {
    // if 'citation' in notForCollections then return the inverse, so true becomes false
    console.log('section', section)
    console.log(notForCollections.includes(section))
    return !notForCollections.includes(section)
  }

  if (resourceType == ResourceType.Dataset) return true

  if (resourceType == ResourceType.Product) {
    return !notForProducts.includes(section)
  }

  return false
}
