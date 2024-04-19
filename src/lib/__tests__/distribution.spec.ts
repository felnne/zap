import { describe, it, expect } from 'vitest'

import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { getFormatByType, getOrganisation } from '@/lib/data'
import { createOrgPointOfContact } from '@/lib/contacts'

import {
  createDistributor,
  getFileFormat,
  createDistributionOption,
  createDownloadDistributionOption,
  createServiceDistributionOption,
} from '@/lib/distribution'

const expectedOrganisation: Organisation = getOrganisation('bas_magic')

const expectedFormat: Format = getFormatByType('image/png') as Format

const expectedSizeBytes = 123

const expectedDistributor: IsoContact = createOrgPointOfContact(expectedOrganisation, 'distributor')

const expectedUrl = 'https://example.com'

const expectedOnlineResource = {
  href: expectedUrl,
  title: 'PNG',
  description: 'Download information as a PNG image',
  function: 'download',
}

const expectedDistributionOption: DistributionOption = {
  format: {
    format: expectedFormat.name,
    href: expectedFormat.url,
  },
  transfer_option: {
    online_resource: expectedOnlineResource,
    size: {
      magnitude: expectedSizeBytes,
      unit: 'bytes',
    },
  },
  distributor: expectedDistributor,
}

describe('createDistributor', () => {
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
    const distributor = createOrgPointOfContact(getOrganisation('nerc_eds_pdc'), 'distributor')
    expect(createDistributor(ResourceType.Dataset, openLicence)).toStrictEqual(distributor)
  })

  it('returns MAGIC for open products', () => {
    expect(createDistributor(ResourceType.Product, openLicence)).toStrictEqual(expectedDistributor)
  })

  it('returns MAGIC for closed products', () => {
    expect(createDistributor(ResourceType.Product, closedLicence)).toStrictEqual(
      expectedDistributor
    )
  })

  it('returns null for other resource types', () => {
    expect(createDistributor(ResourceType.Collection, openLicence)).toStrictEqual(
      expectedDistributor
    )
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
  it('builds a distribution option from a format, size, online resource and organisation', () => {
    expect(
      createDistributionOption(
        expectedFormat,
        expectedOnlineResource,
        expectedDistributor,
        expectedSizeBytes
      )
    ).toStrictEqual(expectedDistributionOption)
  })

  it('builds a distribution option from a format, no size online resource, organisation and size', () => {
    const distOptNoSize: DistributionOption = JSON.parse(JSON.stringify(expectedDistributionOption))
    delete distOptNoSize.transfer_option.size

    expect(
      createDistributionOption(expectedFormat, expectedOnlineResource, expectedDistributor)
    ).toStrictEqual(distOptNoSize)
  })
})

describe('createDownloadDistributionOption', () => {
  it('builds a distribution option from a format, url and organisation', () => {
    expect(
      createDownloadDistributionOption(
        expectedFormat,
        expectedUrl,
        expectedDistributor,
        expectedSizeBytes
      )
    ).toStrictEqual(expectedDistributionOption)
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

    expect(createServiceDistributionOption(service, url, expectedDistributor)).toStrictEqual(
      expectedDistributionOption
    )
  })
})
