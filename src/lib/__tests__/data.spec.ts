import { describe, it, expect } from 'vitest'

import type {
  Collection,
  Format,
  Individual,
  Licence,
  PhysicalSize,
  Series,
  WellKnownExtent,
} from '@/types/app'

import {
  deepMergeObjects,
  getDomainConsistency,
  getCollections,
  getExtent,
  getExtents,
  getFormat,
  getFormatByExtension,
  getFormatByType,
  getFormats,
  getFormatExtensions,
  getIdeas,
  getIndividual,
  getIndividuals,
  getKeywordSet,
  getLicence,
  getLicences,
  getLicencesFiltered,
  getOrganisation,
  getProjection,
  getSeries,
  getServiceSlugs,
  getService,
  getSetting,
  getThumbnails,
} from '@/lib/data'

const checkExtent: WellKnownExtent = {
  slug: 'antarctica',
  name: 'Antarctica',
  extent: {
    geographic: {
      bounding_box: {
        west_longitude: -180,
        east_longitude: 180,
        south_latitude: -90,
        north_latitude: -60,
      },
    },
  },
  projectionSlug: 'epsg_3031',
}

const checkFormat: Format = {
  slug: 'gpkg',
  name: 'GeoPackage',
  description: 'an OGC GeoPackage',
  extensions: ['.gpkg'],
  mediaTypes: ['application/geopackage+sqlite3'],
  url: 'https://www.iana.org/assignments/media-types/application/geopackage+sqlite3',
}

const checkIndividual: Individual = {
  slug: 'https_orcid_org_0000_0003_3703_3888',
  name: 'Fennell, Felix',
  orcid: 'https://orcid.org/0000-0003-3703-3888',
  email: 'felnne@bas.ac.uk',
}

const checkLicence: Licence = {
  slug: 'OGL_UK_3_0',
  name: '(UK) Open Government Licence v3.0',
  url: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  img_light: 'licence-ogl.png',
  img_dark: 'licence-ogl-dark.png',
  statement:
    'This information is licensed under the Open Government Licence v3.0. To view this licence, visit https://www.nationalarchives.gov.uk/doc/open-government-licence/.',
  open: true,
}

describe('deepMergeObjects', () => {
  it('merges simple objects', () => {
    const objB = { b: 3, c: 4 }
    const objC = { a: 1, b: 3, c: 4 }

    expect(deepMergeObjects(objC, objB)).toEqual(objC)
  })

  it('merges nested objects', () => {
    const objA = { a: 1, b: { c: { d: 3 } } }
    const objB = { b: { x: 0, c: { d: 9, e: 5 } }, f: 6 }
    const objC = { a: 1, b: { x: 0, c: { d: 9, e: 5 } }, f: 6 }

    expect(deepMergeObjects(objA, objB)).toEqual(objC)
  })
})

describe('getDomainConsistency', () => {
  it('loads expected domain consistency (profile)', () => {
    const checkExplanation =
      'Resource within scope of British Antarctic Survey (BAS) Mapping and Geographic Information Centre (MAGIC) Discovery Metadata Profile.'

    expect(getDomainConsistency('magic_discovery_v1').explanation).toEqual(checkExplanation)
  })
})

describe('getCollections', () => {
  it('loads some data', () => {
    expect(getCollections().length).toBeGreaterThan(0)
  })

  const checkCollection: Collection = {
    slug: 'd0d91e22_18c1_4c7f_8dfc_20e94cd2c107',
    name: 'BAS General Interest Maps',
    identifier: 'd0d91e22-18c1-4c7f-8dfc-20e94cd2c107',
    href: 'https://data.bas.ac.uk/items/d0d91e22-18c1-4c7f-8dfc-20e94cd2c107',
  }

  it('includes expected collection', () => {
    expect(getCollections()).toContainEqual(checkCollection)
  })
})

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

describe('getFormatExtensions', () => {
  it('loads some data', () => {
    expect(getFormatExtensions().length).toBeGreaterThan(0)
  })

  it('includes expected format extension', () => {
    expect(getFormatExtensions()).toContain('.gpkg')
  })

  it('is sorted alphabetically', () => {
    const formatExtensions = getFormatExtensions()
    const sortedFormatExtensions = formatExtensions.sort((a, b) => a.localeCompare(b))

    expect(formatExtensions).toEqual(sortedFormatExtensions)
  })
})

describe('getIdeas', () => {
  it('loads some data', () => {
    expect(getIdeas().length).toBeGreaterThan(0)
  })

  it('includes expected idea', () => {
    const checkIdea = {
      label: 'Dark mode.',
      state: 'complete',
    }

    expect(getIdeas()).toContainEqual(checkIdea)
  })
})

describe('getIndividual', () => {
  it('loads expected individual', () => {
    expect(getIndividual(checkIndividual.slug)).toEqual(checkIndividual)
  })
})

describe('getIndividuals', () => {
  it('loads some data', () => {
    expect(getIndividuals().length).toBeGreaterThan(0)
  })

  it('includes expected individual', () => {
    expect(getIndividuals()).toContainEqual(checkIndividual)
  })

  it('is sorted alphabetically', () => {
    const individuals = getIndividuals()
    const sortedIndividuals = individuals.sort((a, b) => a.name.localeCompare(b.name))

    expect(individuals).toEqual(sortedIndividuals)
  })
})

describe('getKeywordSet', () => {
  it('loads expected keyword set', () => {
    const checkKeywordSet = {
      slug: '_test_keyword_set',
      terms: [],
    }

    expect(getKeywordSet(checkKeywordSet.slug)).toEqual(checkKeywordSet)
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

describe('getLicencesFiltered', () => {
  it('returns an expected open licence', () => {
    const openLicence = getLicencesFiltered(true)
    expect(openLicence).toContainEqual(checkLicence)
  })

  it('does not return an open licence when closed licences sought', () => {
    const openLicence = getLicencesFiltered(false)
    expect(openLicence).not.toContainEqual(checkLicence)
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
        country: 'United Kingdom',
      },
      online_resource: {
        href: 'https://www.bas.ac.uk',
        title: 'British Antarctic Survey - BAS public website',
        description: 'Homepage for the British Antarctic Survey (BAS) public website.',
        function: 'information',
      },
    }

    expect(getOrganisation(checkOrganisation.slug)).toEqual(checkOrganisation)
  })
})

describe('getProjection', () => {
  it('loads expected projection', () => {
    const checkProjectionSlug = 'epsg_3031'

    expect(getProjection(checkProjectionSlug).slug).toEqual(checkProjectionSlug)
  })
})

describe('getSeries', () => {
  it('loads some data', () => {
    expect(getSeries().length).toBeGreaterThan(0)
  })

  const checkSeries: Series = {
    slug: '321fce3c_8495_428d_b389_985953fe57e5',
    name: 'Charming maps',
  }

  it('includes expected collection', () => {
    expect(getSeries()).toContainEqual(checkSeries)
  })
})

describe('getService', () => {
  it('loads expected service', () => {
    const checkService = {
      slug: 'fake_service',
      name: 'Fake Service Type',
      description: 'Placeholder service type.',
    }

    expect(getService(checkService.slug)).toEqual(checkService)
  })
})

describe('getServiceSlugs', () => {
  it('loads some data', () => {
    expect(getServiceSlugs().length).toBeGreaterThan(0)
  })

  it('includes expected service slug', () => {
    const checkServiceSlug = 'fake_service'

    expect(getServiceSlugs()).toContain(checkServiceSlug)
  })

  it('is sorted alphabetically', () => {
    const serviceSlugs = getServiceSlugs()
    const sortedServiceSlugs = serviceSlugs.sort((a, b) => a.localeCompare(b))

    expect(serviceSlugs).toEqual(sortedServiceSlugs)
  })
})

describe('getSetting', () => {
  it('loads expected setting', () => {
    expect(getSetting('bas_esri_agol_slug')).toEqual('bas')
  })
})

describe('getThumbnails', () => {
  it('loads expected thumbnail type', () => {
    const checkThumbnail = {
      slug: 'overview',
      identifier: 'overview',
      description: 'General overview of resource',
      sizePxH: 128,
      sizePxW: 128,
      mediaTypes: [
        'https://jpeg.org/jpeg/',
        'https://www.iana.org/assignments/media-types/image/png',
      ],
    }

    expect(getThumbnails()[0]).toEqual(checkThumbnail)
  })
})
