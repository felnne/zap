import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { DistributionOptionIndexed, Format, Licence } from '@/types/app'
import type { DistributionOption, PointOfContact as IsoContact } from '@/types/iso'
import { deepMergeObjects, getFormatByType, getFormatExtensions, getLicence } from '@/lib/data'
import { createDistributor, createDownloadDistributionOption } from '@/lib/distribution'

import Downloads from '@/components/sections/elements/Downloads.vue'

const fileIdentifier = 'x'
const licence: Licence = getLicence('OGL_UK_3_0')
const resourceType = ResourceType.Dataset
const expectedFormat: Format = getFormatByType('image/png') as Format
const expectedSizeBytes = 3843
const expectedUrl = 'https://example.com/image.png'
const expectedDistributor: IsoContact = createDistributor(resourceType, licence)

describe('Downloads', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('clicking button adds a new download', async () => {
    const wrapper = mount(Downloads, {
      props: {
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

    // click button
    await wrapper.find('button#add-download').trigger('click')

    // check a upload element is rendered
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

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

describe('Downloads [Integration]', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders a file download if file upload type picked', async () => {
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

    // click add download button
    await wrapper.find('button#add-download').trigger('click')

    // click file upload source
    await wrapper.find('button#upload-file').trigger('click')

    // check a file upload element is rendered
    expect(wrapper.find('#download-1-file').exists()).toBeTruthy()
  })

  it('renders and emits a DistributionOptionIndexed from a download', async () => {
    const expectedDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      expectedUrl,
      expectedDistributor,
      expectedSizeBytes
    )
    const expectedDistributionOptionIndexed: DistributionOptionIndexed = {
      index: '1',
      distributionOption: expectedDistributionOption,
    }

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
    await childComponent.vm.$emit(
      'update:distributionOptionIndexed',
      expectedDistributionOptionIndexed
    )

    expect(wrapper.find('#downloads-output pre').text()).toBe(
      JSON.stringify([expectedDistributionOption], null, 2)
    )

    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[0]) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedDistributionOption])
    }
  })

  it('updates and emits an updated distributionOptionIndexed', async () => {
    const index = '1'
    const initialUrl = ''
    const updatedUrl = expectedUrl
    const expectedInitialDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      initialUrl,
      expectedDistributor,
      expectedSizeBytes
    )
    const expectedUpdatedDistributionOption: DistributionOption = deepMergeObjects(
      { transfer_option: { online_resource: { href: updatedUrl } } },
      expectedInitialDistributionOption
    ) as DistributionOption
    const expectedInitialDistributionOptionIndexed: DistributionOptionIndexed = {
      index: index,
      distributionOption: expectedInitialDistributionOption,
    }
    const expectedUpdatedDistributionOptionIndexed: DistributionOptionIndexed = {
      index: index,
      distributionOption: expectedUpdatedDistributionOption,
    }

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
    await childComponent.vm.$emit(
      'update:distributionOptionIndexed',
      expectedInitialDistributionOptionIndexed
    )

    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[0]) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedInitialDistributionOption])
    }

    // simulate event from child component again (after update)
    await childComponent.vm.$emit(
      'update:distributionOptionIndexed',
      expectedUpdatedDistributionOptionIndexed
    )
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[1]) {
      expect(emittedIsoDistOptionsDownloads[1][0]).toEqual([expectedUpdatedDistributionOption])
    }
  })

  it('removes a download and emits updated distribution options', async () => {
    const expectedDistributionOption: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      expectedUrl,
      expectedDistributor,
      expectedSizeBytes
    )
    const expectedDistributionOptionIndexed: DistributionOptionIndexed = {
      index: '1',
      distributionOption: expectedDistributionOption,
    }

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
    const childComponent = wrapper.findComponent({ name: 'Download' })

    // simulate update event from child component
    await childComponent.vm.$emit(
      'update:distributionOptionIndexed',
      expectedDistributionOptionIndexed
    )
    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[0]) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedDistributionOption])
    }

    // simulate destroy event from child component
    await childComponent.vm.$emit('destroy', expectedDistributionOptionIndexed.index)
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[1]) {
      expect(emittedIsoDistOptionsDownloads[1][0]).toEqual([])
    }
  })

  it('removes a download, leaving existing distribution options and not reusing removed index', async () => {
    const expectedDistributionOption1: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      expectedUrl,
      expectedDistributor,
      expectedSizeBytes
    )
    const expectedDistributionOptionIndexed1: DistributionOptionIndexed = {
      index: '1',
      distributionOption: expectedDistributionOption1,
    }
    const expectedDistributionOption2: DistributionOption = createDownloadDistributionOption(
      expectedFormat,
      'https://example.com/image2.png',
      expectedDistributor,
      expectedSizeBytes
    )
    const expectedDistributionOptionIndexed2: DistributionOptionIndexed = {
      index: '2',
      distributionOption: expectedDistributionOption2,
    }

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

    // add downloads
    await wrapper.find('button#add-download').trigger('click')
    await wrapper.find('button#add-download').trigger('click')

    // simulate event from 1st download child component
    const download1 = wrapper.findAllComponents({ name: 'Download' })[0]
    if (!download1) {
      throw new Error('Download component 1 not found')
    }
    await download1.vm.$emit('update:distributionOptionIndexed', expectedDistributionOptionIndexed1)
    const emittedIsoDistOptionsDownloads: unknown[][] | undefined = wrapper.emitted(
      'update:isoDistOptionsDownloads'
    )
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[0]) {
      expect(emittedIsoDistOptionsDownloads[0][0]).toEqual([expectedDistributionOption1])
    }

    // simulate event from 2nd download child component
    const download2 = wrapper.findAllComponents({ name: 'Download' })[1]
    if (!download2) {
      throw new Error('Download component 2 not found')
    }
    await download2.vm.$emit('update:distributionOptionIndexed', expectedDistributionOptionIndexed2)
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[1]) {
      expect(emittedIsoDistOptionsDownloads[1][0]).toEqual([
        expectedDistributionOption1,
        expectedDistributionOption2,
      ])
    }

    // simulate destroy event from 1st child component
    await download1.vm.$emit('destroy', expectedDistributionOptionIndexed1.index)
    expect(emittedIsoDistOptionsDownloads).toBeTruthy()
    if (emittedIsoDistOptionsDownloads && emittedIsoDistOptionsDownloads[2]) {
      expect(emittedIsoDistOptionsDownloads[2][0]).toEqual([expectedDistributionOption2])
    }

    // add another download
    await wrapper.find('button#add-download').trigger('click')

    // check the new download has a new index
    const download3 = wrapper.findAllComponents({ name: 'Download' })[1]
    if (!download3) {
      throw new Error('Download component 3 not found')
    }
    expect(download3.find('button#download-3-destroy').exists()).toBeTruthy()
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
