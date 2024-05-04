import { afterEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'

import { getSetting } from '@/lib/data'
import { stageFile, encodeSanPath } from '@/lib/upload'

vi.mock('axios')

describe('stageFile', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as any).mockReset()
  })

  it('uploads a file', async () => {
    const fileIdentifier = '123'
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    const expectedUrl = `https://example.com/uploads/${fileIdentifier}/${file.name}`

    const mockResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: { location: expectedUrl },
      config: {},
      request: {},
    }

    ;(axios.post as any).mockResolvedValue(mockResponse)

    const stagedFileUrl = await stageFile(file, fileIdentifier)

    expect(stagedFileUrl).toStrictEqual(expectedUrl)
  })

  it('throws an error if the file has already been uploaded', async () => {
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
    ;(axios.post as any).mockRejectedValue(mockError)

    try {
      await stageFile(file, fileIdentifier)
    } catch (error: any) {
      expect(error.message).toBe(`Error staging file: ${mockError.response.data.error}`)
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
