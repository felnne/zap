import axios from 'axios'
import removeMd from 'remove-markdown'

import type { Identifier } from '../types/iso'

function formatName(name: string): string {
  /*
   * In: 'Watson, Connie'
   * Out: 'Watson, C.'
   */
  const [firstName, lastName] = name.split(', ')
  return `${firstName}, ${lastName.charAt(0)}.`
}

function formatAuthors(authors: string[]): string {
  /*
   * In:
   * ['Watson, Connie']
   * ['Watson, Connie', 'Cinnamon, John']
   * ['Watson, Connie', 'Cinnamon, John', 'Rust, Samantha']
   *
   * Out:
   * 'Watson, C.'
   * 'Watson, C., &amp; Cinnamon, J.'
   * 'Watson, C., Cinnamon, J., &amp; Rust, S.'
   */
  const formattedAuthors = authors.map((author) => formatName(author))

  if (formattedAuthors.length == 1) {
    return formattedAuthors[0]
  }

  if (authors.length > 2) {
    // Join authors into a list, using an ampersand for the last author
    const lastAuthor = formattedAuthors.pop()
    return `${formattedAuthors.join(', ')}, &amp; ${lastAuthor}`
  }

  return ''
}

function formatYear(year: string): string {
  return `(${year}).`
}

function formatTitle(title: string): string {
  return `<i>${removeMd(title)}</i>`
}

function formatVersion(version: string): string {
  return `(Version ${version})`
}

function formatResourceType(resource_type: string): string {
  if (resource_type == 'dataset') {
    return ' [Data set]. '
  }
  if (resource_type == 'product') {
    return ' [Map]. '
  }

  return '  '
}

function formatPublisher(publisher: string): string {
  return `${publisher}.`
}

function formatDoi(doi: string): string {
  const base = 'https://doi.org'
  if (doi == '') {
    return ''
  }

  // skip if already formatted
  if (doi.includes(base)) {
    return doi
  }

  return `${base}/${doi}`
}

export function formatCitation(citation: string, url: string = '', doi: string = ''): string {
  /*
   * Reformats a citation.
   *
   * This method is intended for citations returned by the CrossCite API, however some of the steps below (such as
   * encoding URLs as Markdown links) may apply to citations from other sources.
   *
   * Steps:
   * 1. replace <i> tags with underscores
   * 2. encode url as a lowercase MarkDown link
   * 3. format citation as a blockquote and add a standard introduction
   *
   * For DOI references is included, specified as `[prefix]/[value]` (e.g. '10.5285/93a1479e'):
   * - the URL parameter is set to the DOI as a URL (e.g. 'https://doi.org/10.5285/93a1479e')
   * - to account for UK PDC issued DOIs with uppercase DOI values, the search URL is set to this value to ensure a
   *   matched and replacement with a normalised (lowercase) version
   *
   * To use, pass the citation string. If the citation includes a URL that is not a DOI, set this as the second
   * parameter. If the citation includes a DOI, set this as the third parameter.
   *
   * Example (no reference):
   * formatCitation('Watson, C. (2004). Title. Publisher.')
   *
   * Example (DOI reference):
   * formatCitation('Watson, C. (2004). Title. Publisher. https://doi.org/10.5285/93A1479E-8379-4820-B510-EF8A7639D29D', undefined, '10.5285/93a1479e-8379-4820-b510-ef8a7639d29d')
   *
   * Example (non-DOI reference):
   * formatCitation('Watson, C. (2004). Title. Publisher. https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d', 'https://data.bas.ac.uk/items/93a1479e-8379-4820-b510-ef8a7639d29d')
   *
   * Before:
   * 'Watson, C., &amp; Cinnamon, J. (2004). <i>Ice-cream shop locations</i> (Version 1.0) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/93A1479E-8379-4820-B510-EF8A7639D29D'
   *
   * After:
   * 'Watson, C., &amp; Cinnamon, J. (2004). _Ice-cream shop locations_ (Version 1.0) [Data set]. NERC EDS UK Polar Data Centre. [https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d](https://doi.org/93a1479e-8379-4820-b510-ef8a7639d29d)'
   */
  if (doi != '') {
    url = formatDoi(doi).toLowerCase()
    const urlDoiUpper = formatDoi(doi.toUpperCase())

    if (citation.includes(urlDoiUpper)) {
      url = urlDoiUpper
    }
  }

  const searchUrl = url
  const formattedUrl = `[${url.toLowerCase()}](${url.toLowerCase()})`
  const prefix = 'Required citation: \n > '

  const formattedCitation =
    prefix + citation.replace('<i>', '_').replace('</i>', '_').replace(searchUrl, formattedUrl)

  return formattedCitation
}

export function formatReference(identifier: Identifier): string {
  if (identifier.title == 'data.bas.ac.uk') {
    return identifier.href
  }
  if (identifier.title == 'doi') {
    return formatDoi(identifier.identifier)
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
   * Generated a DOI citation without needing a real DOI.
   *
   * The method is intended for records that don't yet have a DOI, won't have a DOI and for testing.
   *
   * The citation is formatted in the same style requested from the CrossCite API, but using direct inputs rather than
   * DOI metadata. The citation style (APA) is in the form:
   *
   * > "[Contacts] ([Year]). <i>[Title]</i> ([Version]) [Modifier (optional)]. [Publisher]. [DOI]"
   *
   * For compatibility with DOIs issued by the UK PDC, the file identifier (DOI) is converted to uppercase.
   * For compatibility with the `fetchCitation` method, the citation string is wrapped in a Promise.
   */
  const authors_ = formatAuthors(authors)
  const year_ = formatYear(year)
  const title_ = formatTitle(title)
  const version_ = formatVersion(version)
  const modifier_ = formatResourceType(resource_type)
  const publisher_ = formatPublisher(publisher)
  const reference_ = formatReference(identifier)

  const citation = `${authors_} ${year_} ${title_} ${version_}${modifier_}${publisher_} ${reference_}`
  return Promise.resolve(citation)
}

export async function fetchCitation(doi: string): Promise<string> {
  const url = `https://doi.org/${doi}`
  const headers = {
    Accept: 'text/x-bibliography; style=apa'
  }

  try {
    const response = await axios.get<string>(url, { headers })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
