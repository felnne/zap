import { afterEach, describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import type { MockedFunction } from 'vitest'
import type { AxiosInstance } from 'axios'

import { summariseAbstract } from '@/lib/ai'

vi.mock('axios')

describe('summariseAbstract', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockReset()
  })

  it('summarises an abstract', async () => {
    const abstract = '...'
    const expectedSummary =
      'This product offers detailed information on a specific topic, including data trends and analysis. It is designed for users seeking comprehensive insights and up-to-date information within the specified area of interest.'
    const payload = {
      id: 'chatcmpl-TEST',
      choices: [
        {
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
          message: {
            content: expectedSummary,
            role: 'assistant',
            refusal: null,
          },
        },
      ],
      created: 1728216464,
      model: 'gpt-4o-2024-08-06',
      object: 'chat.completion',
      system_fingerprint: 'fp_test',
      usage: {
        completion_tokens: 36,
        prompt_tokens: 114,
        total_tokens: 150,
        prompt_tokens_details: {
          cached_tokens: 0,
        },
        completion_tokens_details: {
          reasoning_tokens: 0,
        },
      },
    }

    const mockResponse = {
      data: payload,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    const summary = await summariseAbstract(abstract)

    expect(summary).toStrictEqual(expectedSummary)
  })

  it('throws an error if proxy encounters a completions error', async () => {
    const abstract = '...'
    const payload = {
      id: 'chatcmpl-TEST',
      choices: [],
      created: 1728216464,
      model: 'gpt-4o-2024-08-06',
      object: 'chat.completion',
      system_fingerprint: 'fp_test',
      usage: {
        completion_tokens: 36,
        prompt_tokens: 114,
        total_tokens: 150,
        prompt_tokens_details: {
          cached_tokens: 0,
        },
        completion_tokens_details: {
          reasoning_tokens: 0,
        },
      },
    }

    const mockResponse = {
      data: payload,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockResolvedValue(mockResponse)

    try {
      await summariseAbstract(abstract)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('OpenAI Proxy error')
      }
    }
  })

  it('throws an error if proxy encounters a general error', async () => {
    const abstract = '...'

    const mockError = {
      isAxiosError: true,
      response: {
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {},
        request: {},
      },
    }
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockRejectedValue(mockError)

    try {
      await summariseAbstract(abstract)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe('OpenAI Proxy error')
      }
    }
  })
})
