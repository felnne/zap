import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Service from '@/sections/Service.vue'

const expectedService = 'test'

describe('Service', () => {
  it('renders output when selected', async () => {
    const expectedEndpoint = 'https://www.example.com'

    const wrapper = mount(Service, {
      props: { slug: expectedService },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // enable service
    // `input#service--selection` should be `input#service-${expectedService}-selection` but can't until refactoring
    await wrapper.find(`input#service--selection`).setValue()

    // set endpoint (needs to be after it's enabled)
    // `input#service--endpoint` should be `input#service-${expectedService}-endpoint` but can't until refactoring
    await wrapper.find(`input#service--endpoint`).setValue(expectedEndpoint)

    expect(wrapper.find('pre').text()).toContain(expectedEndpoint)
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(Service, {
      props: { slug: expectedService },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // `input#service--endpoint` should be `input#service-${expectedService}-endpoint` but can't until refactoring
    const inputElement = wrapper.find(`input#service--endpoint`)
    expect(inputElement.attributes().disabled).toBe('')
  })
})
