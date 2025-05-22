import type { Individual, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'
import { getOrganisation } from '@/lib/data'

export const createAuthor = (individual: Individual, organisation: Organisation): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an application individual and organisation object
   *
   * Application individual/organisation objects are supersets of an ISO Point of Contact with more specific properties
   * mapped to generic ISO equivalents (e.g. the schema of the linked identifier is mapped to a generic 'title').
   *
   * An ORCID identifier is optional, and if present set as the online_resource for the contact.
   *
   * The role of the point of contact is (logically) fixed as 'author' in this context.
   */
  return {
    ...createOrgPointOfContact(organisation, 'author'),
    individual: {
      name: individual.name,
      ...(individual.orcid ? { href: individual.orcid, title: 'orcid' } : {}),
    },
    ...(individual.email ? { email: individual.email } : {}),
    ...(individual.orcid
      ? {
          online_resource: {
            href: individual.orcid,
            title: 'ORCID record',
            description:
              'ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.',
            function: 'information',
          },
        }
      : {}),
    role: ['author'],
  }
}

export const createOrgSlugPointOfContact = (organisationSlug: string, role: string): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an app organisation, specified by its slug, for of a given role
   *
   * Application organisation objects are supersets of an ISO Point of Contact with more specific properties which
   * are mapped to generic ISO equivalents (e.g. the schema of the linked identifier is mapped to a generic 'title').
   *
   * The role of the Point of Contact is any valid ISO role (e.g. 'pointOfContact', 'publisher', 'distributor', etc.).
   */
  const organisation = getOrganisation(organisationSlug)
  return createOrgPointOfContact(organisation, role)
}

export const createOrgPointOfContact = (organisation: Organisation, role: string): Contact => {
  /*
   * Create an ISO 19115 Point of Contact from an app organisation for of a given role
   *
   * Application organisation objects are supersets of an ISO Point of Contact with more specific properties which
   * are mapped to generic ISO equivalents (e.g. the schema of the linked identifier is mapped to a generic 'title').
   *
   * The role of the Point of Contact is any valid ISO role (e.g. 'pointOfContact', 'publisher', 'distributor', etc.).
   */
  const contact: Contact = {
    organisation: {
      name: organisation.name,
      href: organisation.ror,
      title: 'ror',
    },
    phone: organisation.phone,
    address: organisation.address,
    online_resource: organisation.online_resource,
    role: [role],
  }
  if (organisation.email) {
    contact.email = organisation.email
  }

  return contact
}
