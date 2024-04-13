import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import type { Format, Licence } from '@/types/app'

import {
  createDistributor,
  getDistributorOrgSlug,
  getFileFormat,
  createDistributionOption,
  createDownloadDistributionOption,
  createServiceDistributionOption,
} from '@/lib/distribution'

const organisation = {
  slug: 'bas',
  name: 'British Antarctic Survey',
  ror: 'https://ror.org/01rhff309',
  phone: '+44 (0)1223 221400',
  email: 'info@bas.ac.uk',
  address: {
    delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
    city: 'Cambridge',
    administrative_area: 'Cambridgeshire',
    postal_code: 'CB3 0ET',
    country: 'United Kingdom',
  },
  online_resource: {
    href: 'https://www.bas.ac.uk',
    title: 'British Antarctic Survey - BAS public website',
    description: 'Homepage for the British Antarctic Survey (BAS) public website.',
    function: 'information',
  },
}

const expectedFormat: Format = {
  slug: 'png',
  name: 'PNG',
  description: 'a PNG image',
  extensions: ['.png'],
  mediaTypes: ['image/png'],
  url: 'https://www.iana.org/assignments/media-types/image/png',
}

const expectedDistributor = {
  organisation: {
    name: organisation.name,
    href: organisation.ror,
    title: 'ror',
  },
  phone: organisation.phone,
  address: organisation.address,
  email: organisation.email!,
  online_resource: organisation.online_resource,
  role: ['distributor'],
}

describe('createDistributor', () => {
  it('builds a distributor from an organisation', () => {
    expect(createDistributor(organisation)).toStrictEqual(expectedDistributor)
  })
})

describe('getDistributorOrgSlug', () => {
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
    expect(getDistributorOrgSlug(ResourceType.Dataset, openLicence)).toBe('nerc_eds_pdc')
  })

  it('returns null for closed datasets', () => {
    expect(getDistributorOrgSlug(ResourceType.Dataset, closedLicence)).toBe(null)
  })

  it('returns MAGIC for open products', () => {
    expect(getDistributorOrgSlug(ResourceType.Product, openLicence)).toBe('bas_magic')
  })

  it('returns MAGIC for closed products', () => {
    expect(getDistributorOrgSlug(ResourceType.Product, closedLicence)).toBe('bas_magic')
  })

  it('returns null for other resource types', () => {
    expect(getDistributorOrgSlug(ResourceType.Collection, openLicence)).toBe(null)
  })
})

describe('getFileFormat', () => {
  it('returns format for file, identified by media type', () => {
    const file: File = {
      name: 'foo.png.x',
      type: 'image/png',
      lastModified: 0,
      webkitRelativePath: '',
      size: 0,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
    }

    expect(getFileFormat(file)).toStrictEqual(expectedFormat)
  })

  it('returns format for file, identified by file extension', () => {
    const file: File = {
      name: 'foo.png',
      type: '',
      lastModified: 0,
      webkitRelativePath: '',
      size: 0,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
    }

    expect(getFileFormat(file)).toStrictEqual(expectedFormat)
  })

  it('raises error when format cannot be determined', () => {
    const file: File = {
      name: 'foo.bar',
      type: '',
      lastModified: 0,
      webkitRelativePath: '',
      size: 0,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
    }

    expect(() => getFileFormat(file)).toThrow('Cannot determine format.')
  })
})

describe('createDistributionOption', () => {
  it('builds a distribution option from a format (without format), online resource and organisation', () => {
    const format = expectedFormat
    const onlineResource = {
      href: 'https://example.com',
      title: 'Example',
      description: 'Example description',
      function: 'download',
    }
    const expectedDistributionOption = {
      format: {
        format: format.name,
        href: format.url,
      },
      transfer_option: {
        online_resource: onlineResource,
      },
      distributor: expectedDistributor,
    }

    expect(createDistributionOption(format, onlineResource, organisation)).toStrictEqual(
      expectedDistributionOption
    )
  })

  it('builds a distribution option from a format (with format), online resource and organisation', () => {
    const format = {
      slug: 'gpkg',
      name: 'GeoPackage',
      version: '1.2',
      extensions: ['.gpkg'],
      mediaTypes: ['application/geopackage+sqlite3'],
      url: 'https://www.iana.org/assignments/media-types/application/geopackage+sqlite3',
    }
    const onlineResource = {
      href: 'https://example.com',
      title: 'Example',
      description: 'Example description',
      function: 'download',
    }
    const expectedDistributionOption = {
      format: {
        format: format.name,
        href: format.url,
        version: format.version,
      },
      transfer_option: {
        online_resource: onlineResource,
      },
      distributor: expectedDistributor,
    }

    expect(createDistributionOption(format, onlineResource, organisation)).toStrictEqual(
      expectedDistributionOption
    )
  })

  it('builds a distribution option from a format, online resource, organisation and size', () => {
    const format = expectedFormat
    const onlineResource = {
      href: 'https://example.com',
      title: 'Example',
      description: 'Example description',
      function: 'download',
    }
    const sizeBytes = 123
    const expectedDistributionOption = {
      format: {
        format: format.name,
        href: format.url,
      },
      transfer_option: {
        online_resource: onlineResource,
        size: {
          magnitude: sizeBytes,
          unit: 'bytes',
        },
      },
      distributor: expectedDistributor,
    }

    expect(createDistributionOption(format, onlineResource, organisation, sizeBytes)).toStrictEqual(
      expectedDistributionOption
    )
  })
})

describe('createDownloadDistributionOption', () => {
  it('builds a distribution option from a file, url and organisation', () => {
    const file: File = {
      name: 'foo.png',
      type: 'image/png',
      lastModified: 0,
      webkitRelativePath: '',
      size: 0,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
    }
    const url = 'https://example.com'
    const expectedDistributionOption = {
      format: {
        format: 'PNG',
        href: 'https://www.iana.org/assignments/media-types/image/png',
      },
      transfer_option: {
        online_resource: {
          href: url,
          title: 'PNG',
          description: 'Download information as a PNG image',
          function: 'download',
        },
      },
      distributor: expectedDistributor,
    }

    expect(createDownloadDistributionOption(file, url, organisation)).toStrictEqual(
      expectedDistributionOption
    )
  })
})

describe('createServiceDistributionOption', () => {
  it('builds a distribution option from a service, online resource and organisation', () => {
    const service = {
      slug: 'wms',
      name: 'OGC Web Map Service (WMS)',
      description: 'Access information as a OGC Web Map Service layer.',
    }
    const url = 'https://example.com'
    const expectedDistributionOption = {
      format: {
        format: 'OGC Web Map Service (WMS)',
        href: 'https://www.ogc.org/standards/wms',
        version: '1.3.0',
      },
      transfer_option: {
        online_resource: {
          href: url,
          title: service.name,
          description: service.description,
          function: 'download',
        },
      },
      distributor: expectedDistributor,
    }

    expect(createServiceDistributionOption(service, url, organisation)).toStrictEqual(
      expectedDistributionOption
    )
  })
})
