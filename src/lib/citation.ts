import removeMd from 'remove-markdown'

import type { Identifier } from '@/types/iso'
import { CitationTemplate } from '@/types/enum'

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
    return formattedAuthors[0]
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

  const base = 'https://doi.org'

  // skip if already formatted
  if (doi.includes(base)) {
    return doi
  }

  return `${base}/${doi}`
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
  if (identifier.namespace == 'doi') {
    return identifier.href
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
   *  > {authors} ({publication_year}). <i>{title}</i> ({edition}) [{resource_type}]. [{publisher}]. {doi}.
   * >> {authors} ({publication_year}). <i>{title}</i> '(Version {edition})' '[Data set]'. [{publisher}]. {doi}.
   * >>> "Watson, C. (2014). <i>My first data set</i> (Version 1) [Data set]. NERC EDS UK Polar Data Centre.
   * >>> https://data.bas.ac.uk/items/53d75342-b289-4926-a45b-4d3bbcabe795."
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

export function createCitationMagicMapsGeneral(
  year: string,
  edition: string,
  identifier: Identifier
): string {
  // As per: https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/issues/5#note_129772
  //   > {prefix}, {creation_year}, {edition}, {reference}
  //  >> 'Produced by the Mapping and Geographic Information Centre, British Antarctic Survey', {creation_year}, 'version {edition}', {reference}
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
  // https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/issues/5#note_129772
  //   > {producer}, {creation_year}. {title}, {scale}. {series}, {sheet}. {edition}. {publisher_location}, {publisher}
  //  >> 'British Antarctic Survey', {creation_year}. {title}, '1:{scale} scale map'. {series}, {sheet}, 'edition {edition}'. 'Cambridge', 'British Antarctic Survey'
  // >>> "British Antarctic Survey, 2017. Scotia Sea, 1:4 000 000 scale map. BAS (UKAHT) Series, sheet 1B, edition 7. Cambridge, British Antarctic Survey."
  const producer = 'British Antarctic Survey'
  let scale_ = `${formatScale(scale)} scale map`
  const sheet_ = `sheet ${sheet}`
  const edition_ = `edition ${edition}`
  const publisher_location = 'Cambridge'
  const publisher = producer

  // Workaround for not being able to set scale to a placeholder value
  if (scale == -1) {
    scale_ = '?scale'
  }

  return `${producer}, ${year}. ${title}, ${scale_}. ${series}, ${sheet_}, ${edition_}. ${publisher_location}, ${publisher}.`
}

export function filterCitationTemplates(resourceType: string): CitationTemplate[] {
  /* Filter citation templates based on resource type. */
  if (resourceType == 'dataset') {
    return [CitationTemplate.dataset]
  }

  if (resourceType == 'product') {
    return [CitationTemplate.productMapMagicGeneral, CitationTemplate.productMapMagicPublished]
  }

  return [CitationTemplate.unknown]
}

export function defaultCitationTemplate(resourceType: string): CitationTemplate {
  /* Get default citation template for a given resource type.  */
  if (resourceType === 'dataset') {
    return CitationTemplate.dataset
  }

  if (resourceType === 'product') {
    return CitationTemplate.productMapMagicGeneral
  }

  return CitationTemplate.unknown
}
