import axios from 'axios'

import { getSetting } from '@/lib/data'

export async function stageFile(file: File, fileIdentifier: string): Promise<string> {
  /*
   * Upload a file to a staging endpoint and return URL
   *
   * The target for this service is a very minimal implementation for prototyping purposes.
   * A real service would be more complex, and so this function would be as well.
   *
   * The target service expects:
   * - a multi-part form POST request with the part named 'file'
   * - a 'app-file-identifier' header (to organise artefacts per resource)
   *
   * If successful, the target service returns a URL to the uploaded file in the 'location' header.
   */
  const url = getSetting('app_file_upload_endpoint')
  const headers = { 'app-file-identifier': fileIdentifier }
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post<string>(url, formData, { headers })
    return response.headers.location
  } catch (error: any) {
    if (error && error.response && error.response.data && error.response.data.error) {
      throw new Error(`Error staging file: ${error.response.data.error}`)
    }

    throw new Error('Error staging file')
  }
}
