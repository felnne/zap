import { describe, it, expect } from 'vitest'

import {
  formatName,
  formatAuthors,
  formatYear,
  formatTitle,
  formatVersion,
  formatResourceType,
  formatPublisher,
  formatDoi,
  formatCitation,
  formatReference,
  fetchFakeCitation,
} from '@/utils/citation'

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

describe('formatYear', () => {
  it('formats a year', () => {
    expect(formatYear('2014')).toBe('(2014).')
  })
})

describe('formatTitle', () => {
  it('formats a title', () => {
    expect(formatTitle('Title')).toBe('<i>Title</i>')
  })
})

describe('formatVersion', () => {
  it('formats a version', () => {
    expect(formatVersion('1.0')).toBe('(Version 1.0)')
  })
})

describe('formatResourceType', () => {
  it('formats a dataset type', () => {
    expect(formatResourceType('dataset')).toBe('[Data set].')
  })

  it('formats a product type', () => {
    expect(formatResourceType('product')).toBe('[Map].')
  })

  it("doesn't format an unknown type", () => {
    expect(formatResourceType('x')).toBe('')
  })
})

describe('formatPublisher', () => {
  it('formats a publisher', () => {
    expect(formatPublisher('Publisher')).toBe('Publisher.')
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

describe('formatCitation', () => {
  it('formats a citation without a reference', () => {
    expect(
      formatCitation('Watson, C. (2014). <i>Title</i> (Version 1.0) [Data set]. Publisher.')
    ).toBe('Required citation:\n> Watson, C. (2014). _Title_ (Version 1.0) [Data set]. Publisher.')
  })

  it('formats a citation with a non-DOI reference', () => {
    expect(
      formatCitation(
        'Watson, C. (2014). <i>Title</i> (Version 1.0) [Data set]. Publisher. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564'
      )
    ).toBe(
      'Required citation:\n> Watson, C. (2014). _Title_ (Version 1.0) [Data set]. Publisher. [https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564](https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564)'
    )
  })

  it('formats a citation with a DOI reference', () => {
    expect(
      formatCitation(
        'Watson, C. (2014). <i>Title</i> (Version 1.0) [Data set]. Publisher. https://doi.org/10.5066/f7vq30rm',
        undefined,
        'https://doi.org/10.5066/f7vq30rm'
      )
    ).toBe(
      'Required citation:\n> Watson, C. (2014). _Title_ (Version 1.0) [Data set]. Publisher. [https://doi.org/10.5066/f7vq30rm](https://doi.org/10.5066/f7vq30rm)'
    )
  })

  it('formats a citation with a DOI reference in upper case', () => {
    expect(
      formatCitation(
        'Watson, C. (2014). <i>Title</i> (Version 1.0) [Data set]. Publisher. https://doi.org/10.5066/F7VQ30RM',
        undefined,
        'https://doi.org/10.5066/F7VQ30RM'
      )
    ).toBe(
      'Required citation:\n> Watson, C. (2014). _Title_ (Version 1.0) [Data set]. Publisher. [https://doi.org/10.5066/f7vq30rm](https://doi.org/10.5066/f7vq30rm)'
    )
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

  it("doesn't return an unknown reference", () => {
    expect(
      formatReference({
        namespace: 'x',
        identifier: 'y',
        href: 'z',
      })
    ).toBe('')
  })
})

describe('fetchFakeCitation', () => {
  it('fetches a fake citation', async () => {
    expect(
      await fetchFakeCitation(
        ['Watson, Constance'],
        '2014',
        'Title',
        '1.0',
        'dataset',
        'Publisher',
        {
          namespace: 'data.bas.ac.uk',
          identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
          href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
        }
      )
    ).toBe(
      'Watson, C. (2014). <i>Title</i> (Version 1.0) [Data set]. Publisher. https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564'
    )
  })
})

describe('integration_fetchAndFormatFakeCitation', () => {
  it('fetches and formats a citation', async () => {
    const identifier = {
      namespace: 'data.bas.ac.uk',
      identifier: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
      href: 'https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564',
    }
    const citation = await fetchFakeCitation(
      ['Watson, Constance'],
      '2014',
      'Title',
      '1.0',
      'dataset',
      'Publisher',
      identifier
    )
    expect(await formatCitation(citation, identifier.href)).toBe(
      'Required citation:\n> Watson, C. (2014). _Title_ (Version 1.0) [Data set]. Publisher. [https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564](https://data.bas.ac.uk/items/973c7fed-66d2-42a2-a461-1fdb9bf48564)'
    )
  })
})
