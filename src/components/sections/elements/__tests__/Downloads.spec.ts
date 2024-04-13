import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { DistributionOption } from '@/types/iso'
import { deepMergeObjects, getFormatExtensions, getLicence } from '@/lib/data'
import Downloads from '@/components/sections/elements/Downloads.vue'

const fileIdentifier = 'x'
const licence = getLicence('OGL_UK_3_0')

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

    // check there's 1 input element rendered
    expect(wrapper.find('input#download-1-file').exists()).toBeTruthy()
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

    // // check there's 2 input elements rendered
    expect(wrapper.find('input#download-1-file').exists()).toBeTruthy()
    expect(wrapper.find('input#download-2-file').exists()).toBeTruthy()
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

  // Can't test file inputs as vitest doesn't support file inputs

  // Can't test URL as distribution option not rendered without file selection

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
    expect(wrapper.find('button#add-download').attributes('disabled')).toBe('')
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
    // streamline building this when files are option from download distribution options
    const expectedDistributionOption: DistributionOption = {
      format: {
        format: 'image/png',
        href: 'https://www.iana.org/assignments/media-types/image/png',
      },
      transfer_option: {
        online_resource: {
          title: 'image',
          description: 'Download image',
          function: 'download',
          href: 'https://example.com/image.png',
        },
      },
      distributor: {
        organisation: {
          name: 'Example Corp',
          href: 'https://ror.org/000000000',
          title: 'ror',
        },
        role: ['distributor'],
      },
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
    // streamline building this when files are option from download distribution options
    const expectedInitialDistributionOption: DistributionOption = {
      format: {
        format: 'image/png',
        href: 'https://www.iana.org/assignments/media-types/image/png',
      },
      transfer_option: {
        online_resource: {
          title: 'image',
          description: 'Download image',
          function: 'download',
          href: '',
        },
      },
      distributor: {
        organisation: {
          name: 'Example Corp',
          href: 'https://ror.org/000000000',
          title: 'ror',
        },
        role: ['distributor'],
      },
    }
    const expectedUpdatedDistributionOption: DistributionOption = deepMergeObjects(
      { transfer_option: { online_resource: { href: 'https://example.com/image.png' } } },
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
