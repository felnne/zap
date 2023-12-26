import axios from 'axios'

export function formatCitation(doi: string, citation: string): string {
  /*
   * Reformats the citation returned by CrossCite as MarkDown.
   *
   * Steps:
   * 1. replace <i> tags with underscores
   * 2. encode url as a lowercase MarkDown link
   * 3. format citation as a blockquote and add a standard introduction
   */
  const urlBase = 'https://doi.org/'
  const url = `${urlBase}${doi}`
  const urlUpper = `${urlBase}${doi.toUpperCase()}`
  const prefix = 'Required citation: \n > '

  const formattedCitation =
    prefix + citation.replace('<i>', '_').replace('</i>', '_').replace(urlUpper, `[${url}](${url})`)
  return formattedCitation
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
