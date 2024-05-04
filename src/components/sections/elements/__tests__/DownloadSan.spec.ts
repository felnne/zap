import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { encodeSanPath } from '@/lib/upload'
import { getFormatString } from '@/lib/distribution'

import DownloadSan from '@/components/sections/elements/DownloadSan.vue'

describe('DownloadSan', () => {
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

  it('sets and emits expected URL when path set', async () => {
    const path = '/data/somewhere/foo.png'
    const expectedUrl = encodeSanPath(path)

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
    const path = '/data/somewhere/foo.png'
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
    const path = '/data/somewhere/foo.png'
    const expectedSize = 0

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

    const emittedSize: unknown[][] | undefined = wrapper.emitted('update:sizeBytes')
    expect(emittedSize).toBeTruthy()
    if (emittedSize) {
      expect(emittedSize[0][0]).toEqual(expectedSize)
    }
  })
})
