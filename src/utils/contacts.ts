import { ResourceType } from '@/types/enum'
import type { Individual, Licence, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'
import { getOrganisation } from '@/utils/data'
import { getDistributorOrgSlug } from '@/utils/distribution'

export const createContact = (individual: Individual, organisation: Organisation): Contact => {
  return {
    individual: {
      name: individual.name,
      href: individual.orcid,
      title: 'ocrid',
    },
    organisation: {
      name: organisation.name,
      href: organisation.ror,
      title: 'ror',
    },
    email: individual.email,
    phone: organisation.phone,
    address: organisation.address,
    online_resource: {
      href: individual.orcid,
      title: 'ORCID record',
      description:
        'ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.',
      function: 'information',
    },
    role: ['author'],
  }
}

export const getPublisherOrgSlug = (resourceType: ResourceType, licence: Licence): string => {
  /*
   * Determine which team will act as the publisher for a resource
   *
   * Follows distributor with the exception that:
   * - closed datasets are published by MAGIC
   * - collections are published by MAGIC
   *
   * Returns the slug of the publishing organisation, which can be retrieved using `getOrganisation()`.
   */
  const orgMagic = getOrganisation('bas_magic')
  let distributorSlug = getDistributorOrgSlug(resourceType, licence)

  if (resourceType == ResourceType.Dataset && !licence.open) {
    distributorSlug = orgMagic.slug
  } else if (resourceType == ResourceType.Collection) {
    distributorSlug = orgMagic.slug
  }

  if (distributorSlug == null) {
    throw new Error(
      `Cannot determine publisher for resource type ${resourceType} and licence ${licence.slug}.`
    )
  }

  return distributorSlug
}
