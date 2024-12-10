import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { UploadSource } from '@/types/enum'
import type { Format, Upload as UploadT } from '@/types/app'
import type { GraphicOverview as IsoGraphicOverview } from '@/types/iso'
import { getFormatByType } from '@/lib/data'

import Thumbnail from '@/components/sections/elements/Thumbnail.vue'

const identifier = 'overview'
const description = 'General overview of resource'
const fileIdentifier = 'x'

const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedSizeBytes = 3843
const expectedUrl = 'https://example.com/image.png'

const expectedOverview: IsoGraphicOverview = {
  identifier: identifier,
  description: description,
  href: expectedUrl,
  mime_type: expectedFormat!.mediaTypes![0],
}

describe('Thumbnail', () => {
  it('emits and renders graphic overview when format is valid and URL set', async () => {
    const UploadFile: UploadT = {
      source: UploadSource.File,
      format: expectedFormat,
      sizeBytes: expectedSizeBytes,
      url: expectedUrl,
    }

    const wrapper = mount(Thumbnail, {
      props: {
        identifier: identifier,
        description: description,
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Upload' })
    await childComponent.vm.$emit('update:upload', UploadFile)

    const emittedIsoGraphicOverview: unknown[][] | undefined = wrapper.emitted(
      'update:isoGraphicOverview'
    )
    expect(emittedIsoGraphicOverview).toBeTruthy()
    if (emittedIsoGraphicOverview) {
      expect(emittedIsoGraphicOverview[0][0]).toEqual(expectedOverview)
    }
  })
})
