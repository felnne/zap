import { afterEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import type { MockedFunction } from 'vitest'
import type { AxiosInstance } from 'axios'

import { UploadAccess, UploadContext } from '@/types/enum'
import { uploadFile } from '@/lib/upload'

vi.mock('axios')

describe('uploadFile', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockReset()
  })

  it('uploads a download file', async () => {
    const access = UploadAccess.External
    const context = UploadContext.Download
    const fileIdentifier = '123'
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    const expectedUrl = `https://example.com/uploads/${access}/${context}/${fileIdentifier}/${file.name}`

    const mockResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: { location: expectedUrl },
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const uploadedFileUrl = await uploadFile(
      file,
      fileIdentifier,
      UploadContext.Download,
      UploadAccess.Internal
    )

    expect(uploadedFileUrl).toStrictEqual(expectedUrl)
  })

  it('throws an error if the file has already been uploaded', async () => {
    const access = UploadAccess.External
    const context = UploadContext.Download
    const fileIdentifier = '123'
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })

    const mockError = {
      isAxiosError: true,
      response: {
        data: { error: 'error-file-exists' },
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {},
        request: {},
      },
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockRejectedValue(mockError)

    try {
      await uploadFile(file, fileIdentifier, context, access)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(`Error uploading file: ${mockError.response.data.error}`)
      }
    }
  })
})

describe('statSanPath', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockReset()
  })

  it('returns the size of a file at a path', async () => {
    const path = '/data/somewhere/image.png'
    const expectedSizeBytes = 400

    const mockResponse = {
      data: {},
      status: 204,
      statusText: 'NO CONTENT',
      headers: { 'x-content-length': expectedSizeBytes.toString() },
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const pathSize = await statSanPath(path)

    expect(pathSize).toStrictEqual(expectedSizeBytes)
  })

  it('returns an error if the path is a file that does not exist', async () => {
    const path = '/data/somewhere/not-exist.png'

    const mockError = {
      isAxiosError: true,
      response: {
        data: { error: 'error-path-not-found' },
        status: 404,
        statusText: 'NOT FOUND',
        headers: {},
        config: {},
        request: {},
      },
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockRejectedValue(mockError)

    try {
      await statSanPath(path)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(`Error stating file: ${mockError.response.data.error}`)
      }
    }
  })

  it('returns an error if the path is not for a file', async () => {
    const path = '/data/somewhere/'

    const mockError = {
      isAxiosError: true,
      response: {
        data: { error: 'error-path-not-file' },
        status: 400,
        statusText: 'BAD REQUEST',
        headers: {},
        config: {},
        request: {},
      },
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockRejectedValue(mockError)

    try {
      await statSanPath(path)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(`Error stating file: ${mockError.response.data.error}`)
      }
    }
  })
})

describe('encodeSanPath', () => {
  it('encodes a path for a SAN file', () => {
    const path = '/data/foo/bar.txt'
    const endpoint = getSetting('app_san_endpoint')
    const expectedUrl = `sftp://${endpoint}${path}`

    const encodedPath = encodeSanPath(path)

    expect(encodedPath).toStrictEqual(expectedUrl)
  })
})
