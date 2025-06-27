import axios from 'axios'

import { UploadAccess, UploadContext } from '@/types/enum'
import { getSetting } from '@/lib/data'

export async function uploadFile(
  file: File,
  fileIdentifier: string,
  context: UploadContext,
  access: UploadAccess
): Promise<string> {
  /*
   * Upload a file to a relevant endpoint and return URL
   *
   * Target services, and this method, are very minimal implementations for prototyping purposes.
   *
   * The service expects:
   * - a multi-part form POST request with a part named 'file'
   * - an 'app-file-identifier' header (to organise artefacts per resource)
   * - an 'app-access' header (which is currently ignored)
   *
   * If successful, the target service returns a URL to the uploaded file in the 'location' header.
   */
  let endpoint = getSetting('app_downloads_file_upload_endpoint')
  if (context == UploadContext.Thumbnail) {
    endpoint = getSetting('app_thumbnails_file_upload_endpoint')
  }

  const headers = { 'app-file-identifier': fileIdentifier, 'app-access': access }
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post<string>(endpoint, formData, { headers })
    return response.headers.location
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as { response?: { data?: { error?: string } } }
      const errorMessage = errorObj.response?.data?.error
      if (errorMessage) {
        throw new Error(`Error uploading file: ${errorMessage}`)
      }
    }

    throw new Error('Error uploading file')
  }
}

export async function statSanPath(path: string): Promise<number> {
  /*
   * Validate a SAN path is accessible and return file size
   *
   * The target service, and this method, are very minimal implementations for prototyping purposes.
   *
   * The target service expects:
   * - a form URL encoded POST request with a parameter named 'path'
   *
   * If successful, the target service returns the size of the file in bytes in the 'x-content-length' header.
   */
  const url = getSetting('app_san_stat_endpoint')
  const formData = new FormData()
  formData.append('path', path)

  try {
    const response = await axios.post<string>(url, formData)
    return Number(response.headers['x-content-length'])
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as { response?: { data?: { error?: string } } }
      const errorMessage = errorObj.response?.data?.error
      if (errorMessage) {
        throw new Error(`Error stating file: ${errorMessage}`)
      }
    }

    throw new Error('Error stating file')
  }
}

export function encodeSanPath(path: string): string {
  /*
   * Encode a path for a SAN file
   *
   * Encodes a path as a URL representing a file accessible via SFTP through a given endpoint.
   *
   * Example:
   * > '/data/foo/bar.txt'
   *
   * Out (where 'example.com' is endpoint):
   * < 'sftp://example.com/data/foo/bar.txt'
   */
  const endpoint = getSetting('app_san_endpoint')
  return `sftp://${endpoint}${path}`
}
