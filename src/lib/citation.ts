import axios from 'axios'
import removeMd from 'remove-markdown'

import type { Identifier } from '@/types/iso'

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

export function formatYear(year: string): string {
  /*
   * Format resource year
   *
   * Values are formatted according to the APA style (brackets).
   */
  return `(${year}).`
}

export function formatTitle(title: string): string {
  /*
   * Format resource titles
   *
   * Markdown formatting is removed in this context as the APA style requires italics.
   */
  return `<i>${removeMd(title)}</i>`
}

export function formatVersion(version: string): string {
  /*
   * Format resource version
   *
   * Versions are formatted according to what appears to be the APA style (in brackets with a static 'Version' prefix).
   */
  return `(Version ${version})`
}

export function formatResourceType(resource_type: string): string {
  /*
   * Format resource type
   *
   * Recognised resource types are formatted according to the APA style (square brackets).
   * Products are equated to maps, which may prove to be an over-opinionated simplification.
   *
   * Unknown resource types are returned unchanged.
   */
  let value = ''

  if (resource_type == 'dataset') {
    value = 'Data set'
  } else if (resource_type == 'product') {
    value = 'Map'
  }

  if (value == '') {
    return value
  }

  return `[${value}].`
}

export function formatPublisher(publisher: string): string {
  /* Return publisher value without modification */
  return `${publisher}.`
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

export function formatCitation(citation: string, url: string = '', doi: string = ''): string {
  /*
   * Reformats a citation
   *
   * Intended for citations returned by the CrossCite API, though some of the steps performed (such as encoding URLs as
   * Markdown links) may apply to citations from other sources.
   *
   * Steps:
   * 1. replace <i> tags with underscores
   * 2. encode url as a MarkDown link
   * 3. format citation as a blockquote and add a standard introduction
   *
   * Where a DOI reference is included, specified as either `[prefix]/[value]` or `https://doi.org/[prefix]/[value]`
   * (e.g. '10.5285/93a1479e' or 'https://doi.org/10.5285/93a1479e'):
   * - the URL parameter is set to the DOI as a URL (e.g. 'https://doi.org/10.5285/93a1479e')
   * - note that if the DOI uses uppercase characters, these are converted to lowercase
   *
   * To use, pass the citation string. If the citation includes a URL that is not a DOI, set this as the second
   * parameter, and if the citation includes a DOI, set this as the third parameter.
   *
   * Example (no reference):
   * formatCitation('Watson, C. (2004). Title. Publisher.')
   *
   * Example (DOI reference):
   * formatCitation('Watson, C. (2004). Title. Publisher. https://doi.org/10.5285/93A1479E-8379-4820-B510-ef8a7639d29d', undefined, '10.5285/93a1479e-8379-4820-b510-ef8a7639d29d')
   *
   * Example (non-DOI reference):
   * formatCitation('Watson, C. (2004). Title. Publisher. https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d', 'https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d')
   *
   * Citation before:
   * 'Watson, C., &amp; Cinnamon, J. (2004). <i>Ice-cream shop locations</i> (Version 1.0) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/93a1479e-8379-4820-b510-ef8a7639d29d'
   *
   * Citation after:
   * 'Watson, C., &amp; Cinnamon, J. (2004). _Ice-cream shop locations_ (Version 1.0) [Data set]. NERC EDS UK Polar Data Centre. [https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d](https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d)'
   */
  if (doi != '') {
    url = formatDoi(doi)
  }

  const formattedUrl = url.toLowerCase()
  const replaceUrl = `[${formattedUrl}](${formattedUrl})`
  const prefix = 'Required citation:\n> '

  // if `url` is `''`, the reg-ex `/$^/` is used as the search value to not match anything, making replacement
  // conditional. Without this, the citation would be prefixed with an empty Markdown link where no URL is provided.
  return (
    prefix +
    citation
      .replace('<i>', '_')
      .replace('</i>', '_')
      .replace(url ? url : /$^/, replaceUrl)
  )
}

export function formatReference(identifier: Identifier): string {
  /*
   * Return a reference for an identifier
   *
   * The reference being something that can be included in a citation referring to the resource.
   *
   * The value to return will depend on the identifier scheme but is usually the identifier.href to give a URL that can
   * be followed. Very well established schemes such as ISBN may return the `identifier.title` alone, as such values are
   * understood by users on their own.
   */
  if (identifier.namespace == 'data.bas.ac.uk') {
    return identifier.href
  }
  if (identifier.namespace == 'doi') {
    return identifier.href
  }

  return ''
}

export async function fetchFakeCitation(
  authors: string[],
  year: string,
  title: string,
  version: string,
  resource_type: string,
  publisher: string,
  identifier: Identifier
): Promise<string> {
  /*
   * Generate a DOI citation without needing a real DOI.
   *
   * The method is intended for records that don't yet have a DOI, won't have a DOI and for testing.
   *
   * The citation is formatted in the same style requested from the CrossCite API, but using direct inputs rather than
   * DOI metadata. The citation style (APA) is in the form:
   *
   * > "[Contacts] ([Year]). <i>[Title]</i> ([Version]) [Modifier (optional)]. [Publisher]. [DOI]"
   *
   * For compatibility with DOIs issued by the UK PDC, the file identifier (DOI) is converted to uppercase.
   * For compatibility with the async nature of `fetchCitation()`, the citation string is wrapped in a Promise.
   */
  const authors_ = formatAuthors(authors)
  const year_ = formatYear(year)
  const title_ = formatTitle(title)
  const version_ = formatVersion(version)
  const modifier_ = formatResourceType(resource_type)
  const publisher_ = formatPublisher(publisher)
  const reference_ = formatReference(identifier)

  const citation = `${authors_} ${year_} ${title_} ${version_} ${modifier_} ${publisher_} ${reference_}`
  return Promise.resolve(citation)
}

export async function fetchCitation(doi: string): Promise<string> {
  /*
   * Fetch a citation for a DOI using the CrossCite API
   *
   * Uses content negotiation to request a citation in the given format and style (APA).
   * See https://citation.crosscite.org/docs.html#sec-4-1 for details.
   *
   * The response is a pre-formed citation string.
   */
  const url = `https://doi.org/${doi}`
  const headers = {
    Accept: 'text/x-bibliography; style=apa',
  }

  const response = await axios.get<string>(url, { headers })
  return response.data
}
