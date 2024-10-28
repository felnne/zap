import { afterEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'

import type { MockedFunction } from 'vitest'
import type { AxiosInstance } from 'axios'
import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { getFormatByType, getOrganisation } from '@/lib/data'
import { createOrgPointOfContact } from '@/lib/contacts'

import {
  createDistributor,
  getPdfFormat,
  getFormatString,
  getFormatFile,
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

vi.mock('axios')

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

describe('getPdfFormat', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockReset()
  })

  it('determines a regular PDF is not georeferenced', async () => {
    const file = new File(['foo'], 'foo.pdf', {
      type: 'application/pdf',
    })

    const mockResponse = {
      data: { geo_referenced: false },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const pdfFormat = await getPdfFormat(file)

    expect(pdfFormat.slug).toStrictEqual('pdf')
  })

  it('determines a geo PDF is georeferenced', async () => {
    const file = new File(['foo'], 'foo.pdf', {
      type: 'application/pdf',
    })

    const mockResponse = {
      data: { geo_referenced: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const pdfFormat = await getPdfFormat(file)

    expect(pdfFormat.slug).toStrictEqual('pdf_geo')
  })

  it('falls back a regular PDF if an error occurs', async () => {
    const file = new File(['foo'], 'foo.pdf', {
      type: 'application/pdf',
    })

    const mockResponse = {
      data: {},
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const pdfFormat = await getPdfFormat(file)

    expect(pdfFormat.slug).toStrictEqual('pdf')
  })
})

describe('getFormatString', () => {
  it('returns format string for format', () => {
    expect(getFormatString('image.png')).toStrictEqual(expectedFormat)
    expect(getFormatString('/data/somewhere/image.png')).toStrictEqual(expectedFormat)
    expect(getFormatString('https://example.com/image.png')).toStrictEqual(expectedFormat)
  })

  it('raises error when format cannot be determined', () => {
    expect(() => getFormatString('foo.bar')).toThrow('Cannot determine format.')
  })
})

describe('getFileFormat', () => {
  it('returns format for file, identified by media type', async () => {
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

    expect(await getFormatFile(file)).toStrictEqual(expectedFormat)
  })

  it('returns format for file, identified by file extension', async () => {
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

    expect(await getFormatFile(file)).toStrictEqual(expectedFormat)
  })

  it('returns expected format for a georeferenced PDF file', async () => {
    const file: File = {
      name: 'foo.pdf',
      type: 'application/pdf',
      lastModified: 0,
      webkitRelativePath: '',
      size: 0,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
    }

    // for use in getPdfFormat call
    const mockResponse = {
      data: { geo_referenced: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    expect((await getFormatFile(file)).slug).toStrictEqual('pdf_geo')
  })

  it('raises error when format cannot be determined', async () => {
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

    await expect(async () => {
      await getFormatFile(file)
    }).rejects.toThrow('Cannot determine format.')
  })

  // need test for geoPDF conditional
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
