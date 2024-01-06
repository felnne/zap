import type { Individual, Organisation } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'

export const createContact = (individual: Individual, organisation: Organisation): Contact => {
  return {
    individual: {
      name: individual.name,
      href: individual.orcid,
      title: 'ocrid'
    },
    organisation: {
      name: organisation.name,
      href: organisation.ror,
      title: 'ror'
    },
    email: individual.email,
    phone: organisation.phone,
    address: organisation.address,
    online_resource: {
      href: individual.orcid,
      title: 'ORCID record',
      description:
        'ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.',
      function: 'information'
    },
    role: ['author']
  }
}
