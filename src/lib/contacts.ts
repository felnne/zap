import { ResourceType } from '@/types/enum'
import type { Individual, Licence, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'
import { getOrganisation } from '@/lib/data'
import { getDistributorOrgSlug } from '@/lib/distribution'

export const createAuthor = (individual: Individual, organisation: Organisation): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an application individual and organisation object
   *
   * Application individual/organisation objects are a superset of an ISO point of contact and have more specific
   * properties which are mapped to available ISO equivalents (e.g. the schema of the linked identifier is mapped to a
   * generic 'title').
   *
   * The role of the point of contact is (logically) fixed as 'author' in this context.
   */
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
