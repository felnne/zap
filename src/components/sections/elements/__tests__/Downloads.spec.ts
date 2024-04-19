import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Format, Licence, Organisation } from '@/types/app'
import type { DistributionOption } from '@/types/iso'
import {
  deepMergeObjects,
  getFormatByType,
  getFormatExtensions,
  getLicence,
  getOrganisation,
} from '@/lib/data'
import { createDownloadDistributionOption } from '@/lib/distribution'

import Downloads from '@/components/sections/elements/Downloads.vue'

const fileIdentifier = 'x'
const licence: Licence = getLicence('OGL_UK_3_0')
const organisation: Organisation = getOrganisation('nerc_eds_pdc')
const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedUrl = 'https://example.com/image.png'

describe('Downloads', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('clicking button adds a new download', async () => {
    const wrapper = mount(Downloads, {
      props: {
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

    // click button
    await wrapper.find('button#add-download').trigger('click')

    // check a Download element is rendered
    expect(wrapper.find('#download-1').exists()).toBeTruthy()
  })

  it('clicking button multiple times adds multiple downloads', async () => {
    const wrapper = mount(Downloads, {
      props: {
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

    // click button twice
    await wrapper.find('button#add-download').trigger('click')
    await wrapper.find('button#add-download').trigger('click')

    // check a Download elements are rendered
    expect(wrapper.find('#download-1').exists()).toBeTruthy()
    expect(wrapper.find('#download-2').exists()).toBeTruthy()
  })

  it('displays supported extensions', async () => {
    const expectedExtensions = getFormatExtensions()

    const wrapper = mount(Downloads, {
      props: {
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

    // check all extensions are in a code element
    const extensions = wrapper.findAll('code')
    expectedExtensions.every((extension) => {
      const found = extensions.find((e) => e.text() === extension)
      expect(found).toBeTruthy()
    })
  })

  it('prevents adding downloads if no distributor', async () => {
    const closedLicence = getLicence('X_FAKE_CLOSED')
    const wrapper = mount(Downloads, {
      props: {
        fileIdentifier: fileIdentifier,
        resourceType: ResourceType.Dataset,
        licence: closedLicence,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // expect button to be disabled
    expect(wrapper.find('button#add-download').attributes().disabled).not.toBeUndefined()
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

describe('Downloads [Integration]', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('adds and emits a distributionOption', async () => {
    const expectedDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      expectedUrl,
      organisation
    )

    const wrapper = mount(Downloads, {
      props: {
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

    // add download
    await wrapper.find('button#add-download').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Download' })
    await childComponent.vm.$emit('update:isoDistributionOption', expectedDistributionOption)

    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedDistributionOption])
    }
  })

  it('updates and emits an updated distributionOption', async () => {
    // this is no longer a realistic example of when a distributionOption would be updated (as the URL would now never
    // be blank) but I can't think of a better example right now.
    const initialUrl = ''
    const updatedUrl = expectedUrl
    const expectedInitialDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      initialUrl,
      organisation
    )
    const expectedUpdatedDistributionOption: DistributionOption = deepMergeObjects(
      { transfer_option: { online_resource: { href: updatedUrl } } },
      expectedInitialDistributionOption
    )

    const wrapper = mount(Downloads, {
      props: {
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

    // add download
    await wrapper.find('button#add-download').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Download' })
    await childComponent.vm.$emit('update:isoDistributionOption', expectedInitialDistributionOption)

    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedInitialDistributionOption])
    }

    // simulate event from child component again (after update)
    await childComponent.vm.$emit('update:isoDistributionOption', expectedUpdatedDistributionOption)
    if (emittedIsoDistOptionsDownloads) {
      expect(emittedIsoDistOptionsDownloads[1][0]).toEqual([expectedUpdatedDistributionOption])
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
