import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { MockedFunction } from 'vitest'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { encodeSanPath } from '@/lib/upload'
import { getFormatString } from '@/lib/distribution'

import DownloadSan from '@/components/sections/elements/DownloadSan.vue'

vi.mock('axios')

describe('DownloadSan', () => {
  afterEach(() => {
    // cleaning up after the previous test
    ;(axios.post as MockedFunction<AxiosInstance['post']>).mockReset()
  })

  it('renders correctly', async () => {
    const index = 1
    const wrapper = mount(DownloadSan, {
      props: {
        index: index,
      },
    })

    // expect input to exist with id 'download-{expectedIndex}-path'
    expect(wrapper.find(`input#download-${index}-path`).exists()).toBeTruthy()
  })

  it('sets and emits expected URL when path set and triggered', async () => {
    const index = 1
    const path = '/data/somewhere/image.png'
    const expectedUrl = encodeSanPath(path)
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

    const wrapper = mount(DownloadSan, {
      props: {
        index: index,
      },
    })

    // set input with id 'download-{expectedIndex}-path' to path
    const input = wrapper.find(`input#download-${index}-path`)
    input.setValue(path)
    input.trigger('input')

    // simulate click event for button with id 'download-{expectedIndex}-stat'
    await wrapper.findComponent({ name: 'ButtonStat' }).vm.$emit('button-click')

    await flushPromises()

    // expect input with id 'download-{expectedIndex}-url' to have expected value
    expect((wrapper.find(`input#download-${index}-url`).element as HTMLInputElement).value).toBe(
      expectedUrl
    )

    const emittedUrl: unknown[][] | undefined = wrapper.emitted('update:url')
    expect(emittedUrl).toBeTruthy()
    if (emittedUrl) {
      expect(emittedUrl[0][0]).toEqual(expectedUrl)
    }
  })

  // Can't test when path contains an unsupported format triggers alert vitest can't test them

  it('emits format when path set', async () => {
    const path = '/data/somewhere/image.png'
    const expectedFormat = getFormatString(path)

    const index = 1
    const wrapper = mount(DownloadSan, {
      props: {
        index: index,
      },
    })

    // set input with id 'download-{expectedIndex}-path' to path
    const input = wrapper.find(`input#download-${index}-path`)
    input.setValue(path)
    input.trigger('input')

    await wrapper.vm.$nextTick()

    const emittedFormat: unknown[][] | undefined = wrapper.emitted('update:format')
    expect(emittedFormat).toBeTruthy()
    if (emittedFormat) {
      expect(emittedFormat[0][0]).toEqual(expectedFormat)
    }
  })

  it('emits size when path set', async () => {
    const index = 1
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

    const wrapper = mount(DownloadSan, {
      props: {
        index: index,
      },
    })

    // set input with id 'download-{expectedIndex}-path' to path
    const input = wrapper.find(`input#download-${index}-path`)
    input.setValue(path)
    input.trigger('input')

    // simulate click event for button with id 'download-{expectedIndex}-stat'
    await wrapper.findComponent({ name: 'ButtonStat' }).vm.$emit('button-click')

    await flushPromises()

    const emittedSize: unknown[][] | undefined = wrapper.emitted('update:sizeBytes')
    expect(emittedSize).toBeTruthy()
    if (emittedSize) {
      expect(emittedSize[0][0]).toEqual(expectedSizeBytes)
    }
  })
})
