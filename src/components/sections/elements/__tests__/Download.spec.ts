import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import { getFormatByType, getLicence, getOrganisation } from '@/lib/data'
import { createDownloadDistributionOption } from '@/lib/distribution'

import Download from '@/components/sections/elements/Download.vue'

const index = 1
const fileIdentifier = 'x'
const licence: Licence = getLicence('OGL_UK_3_0')
const organisation: Organisation = getOrganisation('nerc_eds_pdc')

const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedUrl = 'https://example.com/image.png'

describe('Download', () => {
  it('emits and renders distribution option when distributor and format are valid and URL set', async () => {
    const expectedDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      expectedUrl,
      organisation
    )

    const wrapper = mount(Download, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
        resourceType: ResourceType.Dataset,
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
    const wrapper = mount(Download, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
        resourceType: ResourceType.Dataset,
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

  it('errors when distributor can not be determined', async () => {
    const closedLicence = getLicence('X_FAKE_CLOSED')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error = null
    const errorHandler = (err: any) => {
      error = err
    }

    const wrapper = mount(Download, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
        resourceType: ResourceType.Dataset,
        licence: closedLicence,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
        config: {
          errorHandler,
        },
      },
    })

    // simulate event from child component and expect error
    const childComponent = wrapper.findComponent({ name: 'DownloadFile' })

    // Wrap the event emission in a Promise to catch the error
    try {
      await new Promise<void>((resolve) => {
        childComponent.vm.$emit('update:format', expectedFormat)
        childComponent.vm.$emit('update:url', expectedUrl)
        resolve()
      })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      if (error instanceof Error) {
        expect(error.message).toBe('No distributor.')
      }
    }
  })
})
