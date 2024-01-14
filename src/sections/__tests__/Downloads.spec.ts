import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import { getFormatExtensions } from '@/utils/data'

import Downloads from '@/sections/Downloads.vue'

describe('Downloads', () => {
  it('clicking button adds a new download', async () => {
    const wrapper = mount(Downloads, {
      props: { resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click button labelled "Add download"
    await wrapper.find('button#add-download').trigger('click')

    // check there's 1 input element rendered
    expect(wrapper.find('input#download-1-input').exists()).toBeTruthy()
  })

  it('clicking button multiple times adds multiple downloads', async () => {
    const wrapper = mount(Downloads, {
      props: { resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click button labelled "Add download"
    await wrapper.find('button#add-download').trigger('click')
    await wrapper.find('button#add-download').trigger('click')

    // // check there's 2 input elements rendered
    expect(wrapper.find('input#download-1-input').exists()).toBeTruthy()
    expect(wrapper.find('input#download-2-input').exists()).toBeTruthy()
  })

  it('displays supported extensions', async () => {
    const expectedExtensions = getFormatExtensions()

    const wrapper = mount(Downloads, {
      props: { resourceType: ResourceType.Dataset },
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
})
