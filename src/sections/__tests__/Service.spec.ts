import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Service from '@/sections/Service.vue'

const expectedService = 'wms'

describe('Service', () => {
  it('renders output when selected', async () => {
    const expectedEndpoint = 'https://www.example.com'

    const wrapper = mount(Service, {
      props: { slug: expectedService },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // enable service
    await wrapper.find(`input#service-wms-selection`).setValue()

    // set endpoint (needs to be after it's enabled)
    await wrapper.find(`input#service-wms-endpoint`).setValue(expectedEndpoint)

    expect(wrapper.find('pre').text()).toContain(expectedEndpoint)
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(Service, {
      props: { slug: expectedService },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const inputElement = wrapper.find(`input#service-wms-endpoint`)
    expect(inputElement.attributes().disabled).toBe('')
  })
})
