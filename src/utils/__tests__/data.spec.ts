import { describe, it, expect } from 'vitest'

import type {Format} from '@/types/app'

import {
  getExtent,
  getExtents,
  getFormat,
  getFormatByExtension,
  getFormatByType,
  getFormats,
  getIdeas,
  getIndividuals,
  getLicence,
  getLicences,
  getOrganisation,
  getServiceSlugs,
  getService
} from '@/utils/data'

const checkExtent = {
  slug: 'antarctica',
  name: 'Antarctica',
  extent: {
    geographic: {
      bounding_box: {
        west_longitude: 180,
        east_longitude: -60,
        south_latitude: -90,
        north_latitude: -180
      }
    }
  }
}

const checkFormat: Format = {
  slug: 'gpkg',
  name: 'GeoPackage',
  version: '1.2',
  extensions: ['.gpkg'],
  mediaTypes: ['application/geopackage+sqlite3'],
  url: 'https://www.iana.org/assignments/media-types/application/geopackage+sqlite3'
}

const checkLicence = {
  slug: 'OGL_UK_3_0',
  name: '(UK) Open Government Licence v3.0',
  url: 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  statement:
    'This information is licensed under the Open Government Licence v3.0. To view this licence, visit http://www.nationalarchives.gov.uk/doc/open-government-licence/.'
}

describe('getExtent', () => {
  it('loads expected extent', () => {
    expect(getExtent(checkExtent.slug)).toEqual(checkExtent)
  })
})

describe('getExtents', () => {
  it('loads some data', () => {
    expect(getExtents().length).toBeGreaterThan(0)
  })

  it('includes expected extent', () => {
    expect(getExtents()).toContainEqual(checkExtent)
  })
})

describe('getFormat', () => {
  it('loads expected format', () => {
    expect(getFormat(checkFormat.slug)).toEqual(checkFormat)
  })
})

describe('getFormatByExtension', () => {
  it('loads expected format', () => {
    expect(getFormatByExtension('.gpkg')).toEqual(checkFormat)
  })

  it('does not load unexpected format', () => {
    expect(getFormatByExtension('.foo')).toBeUndefined()
  })
})

describe('getFormatByType', () => {
  it('loads expected format', () => {
    expect(getFormatByType('application/geopackage+sqlite3')).toEqual(checkFormat)
  })

  it('does not load unexpected format', () => {
    expect(getFormatByType('application/foo')).toBeUndefined()
  })
})

describe('getFormats', () => {
  it('loads some data', () => {
    expect(getFormats().length).toBeGreaterThan(0)
  })

  it('includes expected format', () => {
    expect(getFormats()).toContainEqual(checkFormat)
  })
})

describe('getIdeas', () => {
  it('loads some data', () => {
    expect(getIdeas().length).toBeGreaterThan(0)
  })

  it('includes expected idea', () => {
    const checkIdea = {
      label: 'Dark mode.',
      state: 'complete'
    }

    expect(getIdeas()).toContainEqual(checkIdea)
  })
})

describe('getIndividuals', () => {
  it('loads some data', () => {
    expect(getIndividuals().length).toBeGreaterThan(0)
  })

  it('includes expected individual', () => {
    const checkIndividual = {
      slug: 'https_orcid_org_0000_0003_3703_3888',
      name: 'Fennell, Felix',
      orcid: 'https://orcid.org/0000-0003-3703-3888',
      email: 'felnne@bas.ac.uk'
    }

    expect(getIndividuals()).toContainEqual(checkIndividual)
  })

  it('is sorted alphabetically', () => {
    const individuals = getIndividuals()
    const sortedIndividuals = individuals.sort((a, b) => a.name.localeCompare(b.name))

    expect(individuals).toEqual(sortedIndividuals)
  })
})

describe('getLicence', () => {
  it('loads expected licence', () => {
    expect(getLicence(checkLicence.slug)).toEqual(checkLicence)
  })
})

describe('getLicences', () => {
  it('loads some data', () => {
    expect(getLicences().length).toBeGreaterThan(0)
  })

  it('includes expected licence', () => {
    expect(getLicences()).toContainEqual(checkLicence)
  })
})

describe('getOrganisation', () => {
  it('loads expected organisation', () => {
    const checkOrganisation = {
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

    expect(getOrganisation(checkOrganisation.slug)).toEqual(checkOrganisation)
  })
})

describe('getService', () => {
  it('loads expected service', () => {
    const checkService = {
      slug: 'wms',
      name: 'OGC Web Map Service (WMS)',
      description: 'Access information as a OGC Web Map Service layer.'
    }

    expect(getService(checkService.slug)).toEqual(checkService)
  })
})

describe('getServiceSlugs', () => {
  it('loads some data', () => {
    expect(getServiceSlugs().length).toBeGreaterThan(0)
  })

  it('includes expected service slug', () => {
    const checkServiceSlug = 'wms'

    expect(getServiceSlugs()).toContain(checkServiceSlug)
  })

  it('is sorted alphabetically', () => {
    const serviceSlugs = getServiceSlugs()
    const sortedServiceSlugs = serviceSlugs.sort((a, b) => a.localeCompare(b))

    expect(serviceSlugs).toEqual(sortedServiceSlugs)
  })
})
