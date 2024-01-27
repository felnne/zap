import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import { getFormatExtensions, getLicence } from '@/utils/data'
import Downloads from '@/sections/Downloads.vue'

const licence = getLicence('OGL_UK_3_0')

describe('Downloads', () => {
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
    expect(wrapper.find('input#download-1-input').exists()).toBeTruthy()
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
    expect(wrapper.find('input#download-1-input').exists()).toBeTruthy()
    expect(wrapper.find('input#download-2-input').exists()).toBeTruthy()
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
})
