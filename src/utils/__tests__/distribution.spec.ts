import { describe, it, expect } from 'vitest'

import { createDistributor, createServiceDistributionOption } from '@/utils/distribution'

const organisation = {
  "slug": "bas",
  "name": "British Antarctic Survey",
  "ror": "https://ror.org/01rhff309",
  "phone": "+44 (0)1223 221400",
  "email": "info@bas.ac.uk",
  "address": {
    "delivery_point": "British Antarctic Survey, High Cross, Madingley Road",
    "city": "Cambridge",
    "administrative_area": "Cambridgeshire",
    "postal_code": "CB3 0ET",
    "country": "United Kingdom"
  },
  "online_resource": {
    "href": "https://www.bas.ac.uk",
    "title": "British Antarctic Survey - BAS public website",
    "description": "Homepage for the British Antarctic Survey (BAS) public website.",
    "function": "information"
  }
}

const expectedDistributor = {
  organisation: {
    name: organisation.name,
    href: organisation.ror,
    title: 'ror'
  },
  phone: organisation.phone,
  address: organisation.address,
  email: organisation.email!,
  online_resource: organisation.online_resource,
  role: ['distributor']
}

describe('createDistributor', () => {
  it('builds a distributor from an organisation', () => {
    expect(createDistributor(organisation)).toStrictEqual(expectedDistributor)
  })
})

describe('createServiceDistributionOption', () => {
  it('builds a distribution option from a service, online resource and organisation', () => {
    const service = {
      "slug": "wms",
      "name": "OGC Web Map Service (WMS)",
      "description": "Access information as a OGC Web Map Service layer."
    }
    const endpoint = 'https://example.com'
    const expectedDistributionOption = {
      format: {
        format: 'OGC Web Map Service (WMS)',
        href: 'https://www.ogc.org/standards/wms',
        version: '1.3.0'
      },
      transfer_option: {
        online_resource: {
          href: endpoint,
          title: service.name,
          description: service.description,
          function: 'download'
        }
      },
      distributor: expectedDistributor
    }

    expect(createServiceDistributionOption(service, endpoint, organisation)).toStrictEqual(expectedDistributionOption)
  })
})
