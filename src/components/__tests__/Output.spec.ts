import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Output from '@/components/Output.vue'

describe('Output', () => {
  it('renders properly', () => {
    const text = 'text'

    const wrapper = mount(Output, {
      props: { data: text },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const pre = wrapper.find('pre')
    expect(pre.text()).toBe(text)
    expect(pre.classes()).toContain('max-h-96')
    expect(wrapper.find('button').text()).toBe('Copy')
  })

  it('renders properly with a custom max height', () => {
    const text = 'text'

    const wrapper = mount(Output, {
      props: { data: text, maxHeightClass: 'max-h-24' },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const pre = wrapper.find('pre')
    expect(pre.text()).toBe(text)
    expect(pre.classes()).toContain('max-h-24')
    expect(pre.classes()).not.toContain('max-h-96')
  })

  it('renders properly with copy disabled', () => {
    const text = 'text'

    const wrapper = mount(Output, {
      props: { data: text, enableCopy: false },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('pre').text()).toBe(text)

    // don't expect there to be any button elements
    expect(wrapper.find('button').exists()).not.toBeTruthy()
  })
})
