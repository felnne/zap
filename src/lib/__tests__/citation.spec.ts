import { describe, it, expect } from 'vitest'

import { CitationTemplate } from '@/types/enum'

import {
  formatName,
  formatAuthors,
  formatScale,
  formatDoi,
  formatReference,
  formatCitationAsMarkdown,
  createCitationDataset,
  createCitationMagicMapsGeneral,
  createCitationMagicMapsPublished,
  filterCitationTemplates,
  defaultCitationTemplate,
} from '@/lib/citation'

import collectionsData from '@/data/collections.json'

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
    expect(formatDoi('10.5066/f7vq30rm')).toBe('https://doi.org/10.5066/f7vq30rm')
  })

  it("doesn't format an already formatted value", () => {
    expect(formatDoi('https://doi.org/10.5066/f7vq30rm')).toBe('https://doi.org/10.5066/f7vq30rm')
  })

  it("doesn't format an empty value", () => {
    expect(formatDoi('')).toBe('')
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

  it('formats a doi reference', () => {
    expect(
      formatReference({
        namespace: 'doi',
        identifier: '10.5066/f7vq30rm',
        href: 'https://doi.org/10.5066/f7vq30rm',
      })
    ).toBe('https://doi.org/10.5066/f7vq30rm')
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
  it('creates a citation for a dataset resource', async () => {
    expect(
      createCitationDataset(['Watson, Constance'], '2014', 'Title', '1', 'Publisher', {
        namespace: 'data.bas.ac.uk',
        identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      })
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1) [Data set]. Publisher. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564.'
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
    expect(filterCitationTemplates('x')).toEqual([CitationTemplate.unknown])
  })

  it('filters templates based on a known resource type', async () => {
    expect(filterCitationTemplates('dataset')).toEqual([CitationTemplate.dataset])
  })
})

describe('defaultCitationTemplate', () => {
  it('returns a template based on an unknown resource type without collections', async () => {
    expect(defaultCitationTemplate([], 'x')).toEqual(CitationTemplate.unknown)
  })

  it('returns a template based on a known resource type without collections', async () => {
    expect(defaultCitationTemplate([], 'dataset')).toEqual(CitationTemplate.dataset)
  })

  it('returns magic general maps template for product and relevant collection', async () => {
    const collections = [collectionsData.collections['d0d91e22_18c1_4c7f_8dfc_20e94cd2c107']]
    expect(defaultCitationTemplate(collections, 'product')).toEqual(
      CitationTemplate.productMapMagicGeneral
    )
  })

  it('returns magic published maps template for product and relevant collection', async () => {
    const collections = [collectionsData.collections['6f5102ae_dfae_4d72_ad07_6ce4c85f5db8']]
    expect(defaultCitationTemplate(collections, 'product')).toEqual(
      CitationTemplate.productMapMagicPublished
    )
  })

  it('returns first matching template for multiple collections', async () => {
    // first matching is based on order defined in collections data file, not in record aggregations
    const collections = [
      collectionsData.collections['d0d91e22_18c1_4c7f_8dfc_20e94cd2c107'],
      collectionsData.collections['6f5102ae_dfae_4d72_ad07_6ce4c85f5db8'],
    ]
    expect(defaultCitationTemplate(collections, 'product')).toEqual(
      CitationTemplate.productMapMagicGeneral
    )
  })
})
