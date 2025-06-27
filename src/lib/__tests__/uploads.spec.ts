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
