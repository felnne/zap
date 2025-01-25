import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import type { Licence } from '@/types/app'
import type { PointOfContact as IsoContact } from '@/types/iso'
import { getOrganisation } from '@/lib/data'
import {
  createAuthor,
  createOrgPointOfContact,
  createOrgSlugPointOfContact,
  getPublisherOrgSlug,
} from '@/lib/contacts'

const checkRole = 'pointOfContact'
const checkContact: IsoContact = {
  organisation: {
    name: 'British Antarctic Survey',
    href: 'https://ror.org/01rhff309',
    title: 'ror',
  },
  address: {
    delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
    city: 'Cambridge',
    administrative_area: 'Cambridgeshire',
    postal_code: 'CB3 0ET',
    country: 'United Kingdom',
  },
  phone: '+44 (0)1223 221400',
  online_resource: {
    href: 'https://www.bas.ac.uk',
    title: 'British Antarctic Survey - BAS public website',
    description: 'Homepage for the British Antarctic Survey (BAS) public website.',
    function: 'information',
  },
  role: [checkRole],
}

describe('createAuthor', () => {
  it('builds a contact', () => {
    const individual = {
      slug: 'https_orcid_org_0000_0000_0000_0000',
      name: 'Watson, Connie',
      orcid: 'https://orcid.org/0000-0000-0000-0000',
      email: 'conwat@bas.ac.uk',
    }
    const organisation = getOrganisation('bas')

    const expectedContact = {
      individual: {
        name: individual.name,
        href: individual.orcid,
        title: 'orcid',
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

    expect(createAuthor(individual, organisation)).toStrictEqual(expectedContact)
  })
})

describe('createOrgSlugPointOfContact', () => {
  it('builds a contact', () => {
    const inputSlug = 'bas'
    const inputRole = checkRole

    expect(createOrgSlugPointOfContact(inputSlug, inputRole)).toStrictEqual(checkContact)
  })
})

describe('createOrgPointOfContact', () => {
  it('builds a contact', () => {
    const inputOrg = getOrganisation('bas')
    const inputRole = checkRole

    expect(createOrgPointOfContact(inputOrg, inputRole)).toStrictEqual(checkContact)
  })
})

describe('getPublisherSlug', () => {
  const openLicence: Licence = {
    slug: 'x',
    name: 'x',
    open: true,
    url: 'x',
    statement: 'x',
  }

  const closedLicence: Licence = {
    slug: 'x',
    name: 'x',
    open: false,
    url: 'x',
    statement: 'x',
  }

  it('returns PDC for open datasets', () => {
    expect(getPublisherOrgSlug(ResourceType.Dataset, openLicence)).toBe('nerc_eds_pdc')
  })

  it('returns MAGIC for closed datasets', () => {
    expect(getPublisherOrgSlug(ResourceType.Dataset, closedLicence)).toBe('bas_magic')
  })

  it('returns MAGIC for open products', () => {
    expect(getPublisherOrgSlug(ResourceType.Product, openLicence)).toBe('bas_magic')
  })

  it('returns MAGIC for closed products', () => {
    expect(getPublisherOrgSlug(ResourceType.Product, closedLicence)).toBe('bas_magic')
  })
})
