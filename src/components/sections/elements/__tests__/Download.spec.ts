import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType, UploadSource } from '@/types/enum'
import type { DistributionOptionIndexed, Format, Licence, Upload as UploadT } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { getFormatByType, getLicence } from '@/lib/data'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import Download from '@/components/sections/elements/Download.vue'

const index = '1'
const fileIdentifier = 'x'
const resourceType = ResourceType.Dataset
const licence: Licence = getLicence('OGL_UK_3_0')
const distributor: IsoContact = createDistributor(resourceType, licence)

const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedSizeBytes = 3843
const expectedUrl = 'https://example.com/image.png'

const expectedDistributionOption: DistributionOption = createDownloadDistributionOption(
  expectedFormat,
  expectedUrl,
  distributor,
  expectedSizeBytes
)
const expectedDistributionOptionIndexed: DistributionOptionIndexed = {
  index: index,
  distributionOption: expectedDistributionOption,
}

describe('Download', () => {
  it('emits distribution option when distributor and format are valid and URL set', async () => {
    const UploadFile: UploadT = {
      source: UploadSource.File,
      format: expectedFormat,
      sizeBytes: expectedSizeBytes,
      url: expectedUrl,
    }

    const wrapper = mount(Download, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
        resourceType: resourceType,
        licence: licence,
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

    const emittedIsoDistOptionsDownload: unknown[][] | undefined = wrapper.emitted(
      'update:distributionOptionIndexed'
    )
    expect(emittedIsoDistOptionsDownload).toBeTruthy()
    if (emittedIsoDistOptionsDownload) {
      expect(emittedIsoDistOptionsDownload[0][0]).toEqual(expectedDistributionOptionIndexed)
    }
  })

  it('emits destroy event when remove button clicked', async () => {
    const wrapper = mount(Download, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
        resourceType: resourceType,
        licence: licence,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click #download-{index}-destroy button (e.g. #download-1-destroy)
    await wrapper.find(`button#download-${index}-destroy`).trigger('click')

    const emittedDestroy: unknown[][] | undefined = wrapper.emitted('destroy')
    expect(emittedDestroy).toBeTruthy()
    if (emittedDestroy) {
      expect(emittedDestroy[0][0]).toEqual(index)
    }
  })
})
