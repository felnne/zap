import removeMd from 'remove-markdown'

import { CitationTemplate, ResourceType } from '@/types/enum'
import type { Collection } from '@/types/app'
import type { Identifier } from '@/types/iso'
import { getOrganisation } from '@/lib/data'

export function formatName(name: string): string {
  /*
   * Format resource author
   *
   * According to APA style.
   *
   * If name is not in expected format (two comma separated values), it is returned unchanged.
   *
   * Examples:
   * > 'Watson, Constance'
   * > 'Watson Constance' (no comma, invalid)
   * > 'Watson' (single name, invalid)
   *
   * Out:
   * < 'Watson, C.'
   * < 'Watson Constance'
   * < 'Watson'
   */
  const [lastName, firstName] = name.split(', ')

  if (firstName == undefined) {
    return name
  }

  return `${lastName}, ${firstName.charAt(0)}.`
}

export function formatAuthors(authors: string[]): string {
  /*
   * Format resource authors
   *
   * According to APA style.
   *
   * Examples:
   * > ['Watson, Constance']
   * > ['Watson, Constance', 'Cinnamon, John']
   * > ['Watson, Constance', 'Cinnamon, John', 'Rust, Samantha']
   *
   * < 'Watson, C.'
   * < 'Watson, C., &amp; Cinnamon, J.'
   * < 'Watson, C., Cinnamon, J., &amp; Rust, S.'
   */
  const formattedAuthors = authors.map((author) => formatName(author))

  if (formattedAuthors.length == 1) {
    return formattedAuthors[0]!
  }

  if (authors.length > 1) {
    // Join authors into a list, using an ampersand for the last author
    const lastAuthor = formattedAuthors.pop()
    return `${formattedAuthors.join(', ')}, &amp; ${lastAuthor}`
  }

  return ''
}

export function formatScale(scale: number): string {
  /*
   * Format a map scale
   *
   * Example:
   * > 4000000
   * < 1:4,000,000
   */
  return `1:${scale.toLocaleString()}`
}

export function formatDoi(doi: string): string {
  /*
   * Consistently format a DOI as a URL
   *
   * DOIs are formatted in line with the CrossCite display guidelines (https://www.crossref.org/display-guidelines/),
   * which requires the form `https://doi.org/10.xxxx/xxxxx`.
   *
   * DOIs are additionally formatted as per PDC's preference to use uppercase for the DOI suffix.
   *
   * It is safe to use this method for a DOI that is already formatted correctly (i.e. it will not be double formatted).
   *
   * Example (DOI without URL):
   * > 10.5285/93a1479e-8379-4820-b510-ef8a7639d29d
   * < https://doi.org/10.5285/93a1479e-8379-4820-b510-ef8a7639d29d
   *
   * Example (DOI with URL):
   * > https://doi.org/10.5285/93a1479e-8379-4820-b510-ef8a7639d29d
   * < https://doi.org/10.5285/93a1479e-8379-4820-b510-ef8a7639d29d
   */
  if (doi == '') {
    return ''
  }
  doi = doi.replace('https://doi.org/', '')

  const base = 'https://doi.org'
  const parts = doi.split('/')
  if (parts.length !== 2) {
    throw new Error(`Invalid DOI: "${doi}"`)
  }
  const prefix = parts[0]
  const suffix = parts[1]!.toUpperCase()
  return `${base}/${prefix}/${suffix}`
}

export function formatReference(identifier: Identifier): string {
  /*
   * Return a reference for an identifier
   *
   * The reference being something that can be included in a citation referring to the resource.
   *
   * The value to return will depend on the identifier scheme but is usually the identifier.href to give a URL that can
   * be followed. Unrecognised schemes will return the identifier.identifier as a default.
   */
  if (identifier.namespace == 'data.bas.ac.uk') {
    return identifier.href
  }
  if (identifier.namespace == 'alias.data.bas.ac.uk') {
    return identifier.href
  }
  if (identifier.namespace == 'doi') {
    return formatDoi(identifier.href)
  }

  return identifier.identifier
}

export function formatCitationAsMarkdown(citation: string, url: string = ''): string {
  /*
   * Reformats a citation for use in Markdown editors
   *
   * Steps:
   * 1. replace <i> tags with underscores
   * 2. encode an optional url as a MarkDown link
   * 3. format citation as a blockquote and add a standard introduction
   *
   * If the citation includes a URL, set this as the second parameter.
   *
   * Example (no reference):
   * > formatCitation('Watson, C. (2004). Title. Publisher.')
   * < '> Watson, C. (2004). Title. Publisher.'
   *
   * Example (DOI reference):
   * > formatCitation('Watson, C. (2004). <i>Ice-cream shop locations</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/93A1479E-8379-4820-B510-ef8a7639d29d', 'https://doi.org/10.5285/93a1479e-8379-4820-b510-ef8a7639d29d')
   * < '> Watson, C. (2004). _Ice-cream shop locations_ (Version 1) [Data set]. NERC EDS UK Polar Data Centre. [https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d](https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d)'
   *
   * Example (non-DOI reference):
   * > formatCitation('Watson, C. (2004). Really cool map. Mapping and Geographic Information Centre, British Antarctic Survey. https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d', 'https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d')
   * < '> Watson, C. (2004). Really cool map. Mapping and Geographic Information Centre, British Antarctic Survey. [https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d](https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d)'
   */

  const formattedUrl = url.toLowerCase()
  const replaceUrl = `[${formattedUrl}](${formattedUrl})`

  // if `url` is `''`, the reg-ex `/$^/` is used as the search value to not match anything, making replacement
  // conditional. Without this, the citation would be prefixed with an empty Markdown link where no URL is provided.
  return citation
    .replace('<i>', '_')
    .replace('</i>', '_')
    .replace(url ? url : /$^/, replaceUrl)
}

export function createCitationDataset(
  authors: string[],
  year: string,
  title: string,
  edition: string,
  publisher: string,
  identifier: Identifier
): string {
  /*
   * As per the APA style used by the PDC for datasets.
   *  > {authors} ({publication_year}). <i>{title}</i> ({edition}) [{resource_type}]. [{publisher}]. {doi/link}.
   * >> {authors} ({publication_year}). <i>{title}</i> '(Version {edition})' '[Data set]'. [{publisher}]. {doi/link}.
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/53d75342-B289-4926-A45B-4D3BBCABE795."
   * or if not DOIed:
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://data.bas.ac.uk/items/53d75342-b289-4926-a45b-4d3bbcabe795."
   *
   * For compatibility with DOIs issued by the UK PDC, the file identifier (DOI) is converted to uppercase.
   */
  const authors_ = formatAuthors(authors)
  const year_ = `(${year}).`
  const title_ = `<i>${removeMd(title)}</i>`
  const edition_ = `(Version ${edition})`
  const modifier_ = `[Data set].`
  const publisher_ = `${publisher}.`
  const reference_ = formatReference(identifier)

  return `${authors_} ${year_} ${title_} ${edition_} ${modifier_} ${publisher_} ${reference_}.`
}

export function createCitationDatasetMagic(
  authors: string[],
  year: string,
  title: string,
  edition: string,
  identifier: Identifier
): string {
  /*
   * As per the APA style used by the PDC for datasets but with MAGIC as the publisher and no DOI.
   *  > {authors} ({publication_year}). <i>{title}</i> ({edition}) [{resource_type}]. [{publisher}]. {link}.
   * >> {authors} ({publication_year}). <i>{title}</i> '(Version {edition})' '[Data set]'. [{publisher}]. {link}.
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. BAS Mapping and Geographic Information Centre. https://data.bas.ac.uk/items/53d75342-b289-4926-a45b-4d3bbcabe795."
   *
   * For compatibility with DOIs issued by the UK PDC, the file identifier (DOI) is converted to uppercase.
   */
  return createCitationDataset(
    authors,
    year,
    title,
    edition,
    'BAS Mapping and Geographic Information Centre',
    identifier
  )
}

export function createCitationDatasetPdc(
  authors: string[],
  year: string,
  title: string,
  edition: string,
  identifier: Identifier
): string {
  /*
   * As per the APA style used by the PDC for datasets.
   *  > {authors} ({publication_year}). <i>{title}</i> ({edition}) [{resource_type}]. [{publisher}]. {doi/link}.
   * >> {authors} ({publication_year}). <i>{title}</i> '(Version {edition})' '[Data set]'. [{publisher}]. {doi/link}.
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/53d75342-B289-4926-A45B-4D3BBCABE795."
   * or if not DOIed:
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://data.bas.ac.uk/items/53d75342-b289-4926-a45b-4d3bbcabe795."
   *
   * For compatibility with DOIs issued by the UK PDC, the file identifier (DOI) is converted to uppercase.
   */
  const publisher = getOrganisation('nerc_eds_pdc')
  return createCitationDataset(authors, year, title, edition, publisher.name, identifier)
}

export function createCitationMagicMapsGeneral(
  year: string,
  edition: string,
  identifier: Identifier
): string {
  // Format citation for https://data.bas.ac.uk/items/d0d91e22-18c1-4c7f-8dfc-20e94cd2c107
  // As per: https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/issues/5#note_129772
  //   > {prefix}, {creation_year}, {edition}, {link}
  //  >> 'Produced by the Mapping and Geographic Information Centre, British Antarctic Survey', {creation_year}, 'version {edition}', {link}
  // >>> "Produced by the Mapping and Geographic Information Centre, British Antarctic Survey, 2021, version 1, https://data.bas.ac.uk/items/xxx/."
  const prefix =
    'Produced by the Mapping and Geographic Information Centre, British Antarctic Survey'
  const version = `version ${edition}`
  const reference_ = formatReference(identifier)
  return `${prefix}, ${year}, ${version}, ${reference_}.`
}

export function createCitationMagicMapsPublished(
  year: string,
  title: string,
  scale: number,
  series: string,
  sheet: string,
  edition: string
): string {
  // Format citation for https://data.bas.ac.uk/items/6f5102ae-dfae-4d72-ad07-6ce4c85f5db8
  // https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/issues/5#note_129772
  //   > {producer}, {creation_year}. {title}, {scale}. {series}, {sheet}. {edition}. {publisher_location}, {publisher}
  //  >> 'British Antarctic Survey', {creation_year}. {title}, '1:{scale} scale map'. {series}, {sheet}, 'edition {edition}'. 'Cambridge', 'British Antarctic Survey'
  // >>> "British Antarctic Survey, 2017. Scotia Sea, 1:4 000 000 scale map. BAS (UKAHT) Series, sheet 1B, edition 7. Cambridge, British Antarctic Survey."
  const producer = 'British Antarctic Survey'
  const scale_ = `${formatScale(scale)} scale map`
  const sheet_ = `sheet ${sheet}`
  const edition_ = `edition ${edition}`
  const publisher_location = 'Cambridge'
  const publisher = producer

  return `${producer}, ${year}. ${title}, ${scale_}. ${series}, ${sheet_}, ${edition_}. ${publisher_location}, ${publisher}.`
}

export function filterCitationTemplates(
  resourceType: ResourceType,
  open_licence: boolean
): CitationTemplate[] {
  /* Filter citation templates based on resource type and licence type. */
  if (resourceType == ResourceType.Dataset && open_licence) {
    return [CitationTemplate.datasetPdc, CitationTemplate.datasetMagic]
  }
  if (resourceType == ResourceType.Dataset && !open_licence) {
    return [CitationTemplate.datasetMagic]
  }

  if (resourceType == ResourceType.Product) {
    return [CitationTemplate.productMapMagicGeneral, CitationTemplate.productMapMagicPublished]
  }

  return [CitationTemplate.unknown]
}

export function defaultCitationTemplate(
  filteredTemplates: CitationTemplate[],
  collections: Collection[],
  resourceType: string
): CitationTemplate {
  /* Get default citation template for a given resource type.  */
  if (resourceType === 'dataset') {
    return filteredTemplates[0] || CitationTemplate.unknown
  }

  if (resourceType === 'product') {
    const collectionSlugs = collections.map((collection) => collection.slug)

    if (collectionSlugs.includes('d0d91e22_18c1_4c7f_8dfc_20e94cd2c107')) {
      return CitationTemplate.productMapMagicGeneral
    } else if (collectionSlugs.includes('6f5102ae_dfae_4d72_ad07_6ce4c85f5db8')) {
      return CitationTemplate.productMapMagicPublished
    }

    return CitationTemplate.productMapMagicGeneral
  }

  return CitationTemplate.unknown
}

export function getPreferredReferenceIdentifier(identifiers: Identifier[]): Identifier {
  /*
   * Pick identifier to use as reference for citation.
   *
   * DOI identifiers are most preferred, then aliases, then data catalogue identifiers.
   * DOIs are preferred because they have stronger persistence and immutability guarantees.
   * Alias are preferred because they are preferred by humans.
   */
  const doiIdentifier = identifiers.find((i) => i.namespace === 'doi')
  if (doiIdentifier) {
    return doiIdentifier
  }

  const aliasIdentifier = identifiers.find((i) => i.namespace === 'alias.data.bas.ac.uk')
  if (aliasIdentifier) {
    return aliasIdentifier
  }

  const selfIdentifier = identifiers.find((i) => i.namespace === 'data.bas.ac.uk')
  if (selfIdentifier) {
    return selfIdentifier
  }

  return { identifier: '', href: '', namespace: 'x' }
}

export function getCitation(
  template: CitationTemplate,
  authors: string[],
  creationYear: string,
  publicationYear: string,
  title: string,
  edition: string,
  identifier: Identifier,
  scale: number,
  series: string,
  sheet: string
): string {
  if (template === CitationTemplate.datasetPdc) {
    return createCitationDatasetPdc(authors, publicationYear, title, edition, identifier)
  } else if (template === CitationTemplate.datasetMagic) {
    return createCitationDatasetMagic(authors, publicationYear, title, edition, identifier)
  } else if (template === CitationTemplate.productMapMagicGeneral) {
    return createCitationMagicMapsGeneral(creationYear, edition, identifier)
  } else if (template === CitationTemplate.productMapMagicPublished) {
    return createCitationMagicMapsPublished(creationYear, title, scale, series, sheet, edition)
  } else {
    return '[Error: Unknown citation template]'
  }
}
