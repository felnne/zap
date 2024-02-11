import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import { getFormatExtensions, getLicence } from '@/utils/data'
import Downloads from '@/sections/Downloads.vue'

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
      props: { resourceType: ResourceType.Dataset, licence: licence },
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
      props: { resourceType: ResourceType.Dataset, licence: licence },
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
      props: { resourceType: ResourceType.Dataset, licence: licence },
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
      props: { resourceType: ResourceType.Dataset, licence: closedLicence },
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
