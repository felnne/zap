import { describe, it, expect } from 'vitest'

import { createContact } from '@/utils/contacts'

describe('createContact', () => {
  it('builds a contact', () => {
    const individual = {
      slug: 'https_orcid_org_0000_0000_0000_0000',
      name: 'Watson, Connie',
      orcid: 'https://orcid.org/0000-0000-0000-0000',
      email: 'conwat@bas.ac.uk'
    }
    const organisation = {
      slug: 'bas',
      name: 'British Antarctic Survey',
      ror: 'https://ror.org/01rhff309',
      phone: '+44 (0)1223 221400',
      address: {
        delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
        city: 'Cambridge',
        administrative_area: 'Cambridgeshire',
        postal_code: 'CB3 0ET',
        country: 'United Kingdom'
      },
      online_resource: {
        href: 'https://www.bas.ac.uk',
        title: 'British Antarctic Survey - BAS public website',
        description: 'Homepage for the British Antarctic Survey (BAS) public website.',
        function: 'information'
      }
    }
    const expectedContact = {
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

    expect(createContact(individual, organisation)).toStrictEqual(expectedContact)
  })
})
