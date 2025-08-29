import { describe, it, expect } from 'vitest'

import { CitationTemplate, ResourceType } from '@/types/enum'
import type { Collection } from '@/types/app'

import {
  formatName,
  formatAuthors,
  formatScale,
  formatDoi,
  formatReference,
  formatCitationAsMarkdown,
  createCitationDataset,
  createCitationDatasetPdc,
  createCitationDatasetMagic,
  createCitationMagicMapsGeneral,
  createCitationMagicMapsPublished,
  filterCitationTemplates,
  defaultCitationTemplate,
  getPreferredReferenceIdentifier,
} from '@/lib/citation'

import collectionsData from '@/data/collections.json'
import type { Identifier } from '@/types/iso'

describe('formatName', () => {
  it('formats a name when formatted correctly', () => {
    expect(formatName('Watson, Constance')).toBe('Watson, C.')
  })

  it("doesn't format a name with missing comma", () => {
    expect(formatName('Watson Constance')).toBe('Watson Constance')
  })

  it("doesn't format a name with single name", () => {
    expect(formatName('Watson')).toBe('Watson')
  })
})

describe('formatAuthors', () => {
  it('formats a single author', () => {
    expect(formatAuthors(['Watson, Constance'])).toBe('Watson, C.')
  })

  it('formats two authors', () => {
    expect(formatAuthors(['Watson, Constance', 'Cinnamon, John'])).toBe(
      'Watson, C., &amp; Cinnamon, J.'
    )
  })

  it('formats three authors', () => {
    expect(formatAuthors(['Watson, Constance', 'Cinnamon, John', 'Rust, Samantha'])).toBe(
      'Watson, C., Cinnamon, J., &amp; Rust, S.'
    )
  })

  it("doesn't format empty author list", () => {
    expect(formatAuthors([])).toBe('')
  })
})

describe('formatScale', () => {
  it('formats a scale', () => {
    expect(formatScale(400_000)).toBe('1:400,000')
  })
})

describe('formatDoi', () => {
  it('formats a DOI', () => {
    expect(formatDoi('10.5066/f7vq30rm')).toBe('https://doi.org/10.5066/F7VQ30RM')
  })

  it('formats a DOI URL', () => {
    expect(formatDoi('https://doi.org/10.5066/f7vq30rm')).toBe('https://doi.org/10.5066/F7VQ30RM')
  })

  it("doesn't change an already formatted value", () => {
    expect(formatDoi('https://doi.org/10.5066/F7VQ30RM')).toBe('https://doi.org/10.5066/F7VQ30RM')
  })

  it("doesn't format an empty value", () => {
    expect(formatDoi('')).toBe('')
  })

  it("doesn't format an incomplete value", () => {
    // expect to raise error
    expect(() => formatDoi('123')).toThrowError('Invalid DOI: "123"')
  })
})

describe('formatReference', () => {
  it('formats a data.bas.ac.uk reference', () => {
    expect(
      formatReference({
        namespace: 'data.bas.ac.uk',
        identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe('https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564')
  })

  it('formats an alias.data.bas.ac.uk reference', () => {
    expect(
      formatReference({
        namespace: 'alias.data.bas.ac.uk',
        identifier: '123',
        href: 'https://data.bas.ac.uk/maps/123',
      })
    ).toBe('https://data.bas.ac.uk/maps/123')
  })

  it('formats a doi reference', () => {
    expect(
      formatReference({
        namespace: 'doi',
        identifier: '10.5066/f7vq30rm',
        href: 'https://doi.org/10.5066/f7vq30rm',
      })
    ).toBe('https://doi.org/10.5066/F7VQ30RM')
  })

  it('returns the identifier value of an unknown reference scheme', () => {
    expect(
      formatReference({
        namespace: 'x',
        identifier: 'y',
        href: 'z',
      })
    ).toBe('y')
  })
})

describe('formatCitationAsMarkdown', () => {
  it('formats a citation without a title or URL as markdown', () => {
    expect(formatCitationAsMarkdown('Watson, C. (2014).')).toBe('Watson, C. (2014).')
  })

  it('formats a citation with a formatted title as markdown', () => {
    expect(formatCitationAsMarkdown('Watson, C. (2014). <i>title</i>.')).toBe(
      'Watson, C. (2014). _title_.'
    )
  })

  it('formats a citation with a URL as markdown', () => {
    expect(
      formatCitationAsMarkdown('Watson, C. (2014). https://example.com.', 'https://example.com')
    ).toBe('Watson, C. (2014). [https://example.com](https://example.com).')
  })
})

describe('createCitationDataset', () => {
  it('creates a citation for a dataset resource with a given publisher', async () => {
    expect(
      createCitationDataset(
        ['Watson, Constance'],
        '2014',
        'Title',
        '1',
        'BAS Mapping and Geographic Information Centre',
        {
          namespace: 'data.bas.ac.uk',
          identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
          href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        }
      )
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1) [Data set]. BAS Mapping and Geographic Information Centre. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564.'
    )
  })
})

describe('createCitationDatasetMagic', () => {
  it('creates a citation for a dataset resource with MAGIC as the publisher', async () => {
    expect(
      createCitationDatasetMagic(['Watson, Constance'], '2014', 'Title', '1', {
        namespace: 'data.bas.ac.uk',
        identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1) [Data set]. BAS Mapping and Geographic Information Centre. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564.'
    )
  })
})

describe('createCitationDatasetPdc', () => {
  it('creates a citation for a dataset resource without a DOI', async () => {
    expect(
      createCitationDatasetPdc(['Watson, Constance'], '2014', 'Title', '1', {
        namespace: 'data.bas.ac.uk',
        identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564.'
    )
  })

  it('creates a citation for a dataset resource with a DOI', async () => {
    expect(
      createCitationDatasetPdc(['Watson, Constance'], '2014', 'Title', '1', {
        namespace: 'doi',
        identifier: '10.5285/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://doi.org/10.5285/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/973C7FED-66D2-42A2-A461-1FDB9BF48564.'
    )
  })
})

describe('createCitationMagicMapsGeneral', () => {
  it('creates a citation for a general MAGIC map product resource', async () => {
    expect(
      createCitationMagicMapsGeneral('2014', '1', {
        namespace: 'data.bas.ac.uk',
        identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe(
      'Produced by the Mapping and Geographic Information Centre, British Antarctic Survey, 2014, version 1, https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564.'
    )
  })
})

describe('createCitationMagicMapsGeneral', () => {
  it('creates a citation for a published MAGIC map product resource', async () => {
    expect(
      createCitationMagicMapsPublished('2014', 'Title', 400_000, 'Example Series', '1A', '1')
    ).toBe(
      'British Antarctic Survey, 2014. Title, 1:400,000 scale map. Example Series, sheet 1A, edition 1. Cambridge, British Antarctic Survey.'
    )
  })
})

describe('filterCitationTemplates', () => {
  it('filters templates based on an unknown resource type', async () => {
    const licence_open = true
    const resourceType: ResourceType = 'x' as unknown as ResourceType
    expect(filterCitationTemplates(resourceType, licence_open)).toEqual([CitationTemplate.unknown])
  })

  it('filters templates when a dataset and open licence', async () => {
    const licence_open = true
    expect(filterCitationTemplates(ResourceType.Dataset, licence_open)).toEqual([
      CitationTemplate.datasetPdc,
      CitationTemplate.datasetMagic,
    ])
  })

  it('filters templates when a dataset and closed licence', async () => {
    const licence_open = false
    expect(filterCitationTemplates(ResourceType.Dataset, licence_open)).toEqual([
      CitationTemplate.datasetMagic,
    ])
  })

  it('filters templates when a product', async () => {
    const licence_open = true
    expect(filterCitationTemplates(ResourceType.Product, licence_open)).toEqual([
      CitationTemplate.productMapMagicGeneral,
      CitationTemplate.productMapMagicPublished,
    ])
  })
})

describe('defaultCitationTemplate', () => {
  it('returns a template based on an unknown resource type without collections', async () => {
    const templates = [CitationTemplate.unknown]
    const collections: Collection[] = []
    expect(defaultCitationTemplate(templates, collections, 'x')).toEqual(CitationTemplate.unknown)
  })

  it('returns a template based on a known resource type without collections', async () => {
    const templates = [CitationTemplate.datasetPdc, CitationTemplate.datasetMagic]
    const collections: Collection[] = []
    expect(defaultCitationTemplate(templates, collections, 'dataset')).toEqual(
      CitationTemplate.datasetPdc
    )
  })

  it('returns magic general maps template for product and relevant collection', async () => {
    const templates = [
      CitationTemplate.productMapMagicGeneral,
      CitationTemplate.productMapMagicPublished,
    ]
    const collections: Collection[] = [
      collectionsData.collections['d0d91e22_18c1_4c7f_8dfc_20e94cd2c107'],
    ]
    expect(defaultCitationTemplate(templates, collections, 'product')).toEqual(
      CitationTemplate.productMapMagicGeneral
    )
  })

  it('returns magic published maps template for product and relevant collection', async () => {
    const templates = [
      CitationTemplate.productMapMagicGeneral,
      CitationTemplate.productMapMagicPublished,
    ]
    const collections: Collection[] = [
      collectionsData.collections['6f5102ae_dfae_4d72_ad07_6ce4c85f5db8'],
    ]
    expect(defaultCitationTemplate(templates, collections, 'product')).toEqual(
      CitationTemplate.productMapMagicPublished
    )
  })

  it('returns first matching template for multiple collections', async () => {
    // first matching is based on order defined in collections data file, not in record aggregations
    const templates = [
      CitationTemplate.productMapMagicGeneral,
      CitationTemplate.productMapMagicPublished,
    ]
    const collections: Collection[] = [
      collectionsData.collections['d0d91e22_18c1_4c7f_8dfc_20e94cd2c107'],
      collectionsData.collections['6f5102ae_dfae_4d72_ad07_6ce4c85f5db8'],
    ]
    expect(defaultCitationTemplate(templates, collections, 'product')).toEqual(
      CitationTemplate.productMapMagicGeneral
    )
  })
})

describe('getPreferredReferenceIdentifier', () => {
  const doiIdentifier: Identifier = {
    namespace: 'doi',
    identifier: '10.5066/f7vq30rm',
    href: 'https://doi.org/10.5066/f7vq30rm',
  }
  const aliasIdentifier: Identifier = {
    namespace: 'alias.data.bas.ac.uk',
    identifier: '123',
    href: 'https://data.bas.ac.uk/maps/123',
  }
  const selfIdentifier: Identifier = {
    namespace: 'data.bas.ac.uk',
    identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
    href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
  }

  it('picks DOI where available', async () => {
    const identifiers: Identifier[] = [selfIdentifier, aliasIdentifier, doiIdentifier]
    expect(getPreferredReferenceIdentifier(identifiers)).toEqual(doiIdentifier)
  })

  it('picks alias where available', async () => {
    const identifiers: Identifier[] = [selfIdentifier, aliasIdentifier]
    expect(getPreferredReferenceIdentifier(identifiers)).toEqual(aliasIdentifier)
  })

  it('picks self where nothing else available', async () => {
    const identifiers: Identifier[] = [selfIdentifier]
    expect(getPreferredReferenceIdentifier(identifiers)).toEqual(selfIdentifier)
  })
})
