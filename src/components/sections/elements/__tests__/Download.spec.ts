import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Format, Licence } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { getFormatByType, getLicence } from '@/lib/data'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import Download from '@/components/sections/elements/Download.vue'

const index = 1
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

describe('Download', () => {
  it('emits and renders distribution option when distributor and format are valid and URL set', async () => {
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
    const childComponent = wrapper.findComponent({ name: 'DownloadFile' })
    await childComponent.vm.$emit('update:format', expectedFormat)
    await childComponent.vm.$emit('update:sizeBytes', expectedSizeBytes)
    await childComponent.vm.$emit('update:url', expectedUrl)

    expect(wrapper.find('pre').text()).toBe(JSON.stringify(expectedDistributionOption, null, 2))

    const emittedIsoDistOptionsDownload: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistributionOption'
    )
    expect(emittedIsoDistOptionsDownload).toBeTruthy()
    if (emittedIsoDistOptionsDownload) {
      expect(emittedIsoDistOptionsDownload[0][0]).toEqual(expectedDistributionOption)
    }
  })

  it('does not emit when format is not set', async () => {
    // because format is a proxy for whether the file is an allowed type
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
    const childComponent = wrapper.findComponent({ name: 'DownloadFile' })
    await childComponent.vm.$emit('update:url', expectedUrl)

    const emittedIsoDistOptionsDownload: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistributionOption'
    )
    expect(emittedIsoDistOptionsDownload).not.toBeTruthy()
  })
})
