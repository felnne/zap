import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { UploadSource } from '@/types/enum'
import type { Format, Upload as UploadT } from '@/types/app'
import { getFormatByType } from '@/lib/data'

import Upload from '@/components/bases/Upload.vue'

const context = 'foo'
const identifier = 1
const fileIdentifier = 'x'

const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedSizeBytes = 3843
const expectedUrl = 'https://example.com/image.png'
const expectedUploadFile: UploadT = {
  source: UploadSource.File,
  format: expectedFormat,
  sizeBytes: expectedSizeBytes,
  url: expectedUrl,
}

describe('Upload', () => {
  it('emits and renders upload when format is valid and URL set', async () => {
    const wrapper = mount(Upload, {
      props: {
        context: context,
        identifier: identifier,
        fileIdentifier: fileIdentifier,
      },
    })

    // pick file upload source
    await wrapper.find('button#upload-file').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'UploadFile' })
    await childComponent.vm.$emit('update:format', expectedFormat)
    await childComponent.vm.$emit('update:sizeBytes', expectedSizeBytes)
    await childComponent.vm.$emit('update:url', expectedUrl)

    const emittedUploads: unknown[][] | undefined = wrapper.emitted('update:upload')
    expect(emittedUploads).toBeTruthy()
    if (emittedUploads) {
      // skip to the last index to wait for all property updates to apply
      const emittedUpload = emittedUploads[emittedUploads.length - 1][0]
      expect(emittedUpload).toEqual(expectedUploadFile)
    }
  })

  it('does not emit when format is not set', async () => {
    // because format is a proxy for whether the file is an allowed type
    const wrapper = mount(Upload, {
      props: {
        context: context,
        identifier: identifier,
        fileIdentifier: fileIdentifier,
      },
    })

    // pick file upload source
    await wrapper.find('button#upload-file').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'UploadFile' })
    await childComponent.vm.$emit('update:url', expectedUrl)

    const emittedUpload: unknown[][] | undefined = wrapper.emitted('update:upload')
    expect(emittedUpload).not.toBeTruthy()
  })
})
