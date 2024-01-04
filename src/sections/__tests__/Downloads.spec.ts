import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Clipboard from 'v-clipboard'

import Downloads from '@/sections/Downloads.vue'
import Download from '@/sections/Download.vue'

describe('Downloads', () => {
  it('clicking button adds a new download', async () => {
    const wrapper = mount(Downloads, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // click button labelled "Add download"
    await wrapper.find('button#add-download').trigger('click')

    // check there's 1 input element rendered
    expect(wrapper.find('input#download-1').exists()).toBeTruthy()
  })

  it('clicking button multiple times adds multiple downloads', async () => {
    const wrapper = mount(Downloads, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // click button labelled "Add download"
    await wrapper.find('button#add-download').trigger('click')
    await wrapper.find('button#add-download').trigger('click')

    // // check there's 2 input elements rendered
    expect(wrapper.find('input#download-1').exists()).toBeTruthy()
    expect(wrapper.find('input#download-2').exists()).toBeTruthy()
  })
})
