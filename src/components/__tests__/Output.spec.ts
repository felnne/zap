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
          clipboard: Clipboard
        }
      }
    })

    expect(wrapper.find('pre').text()).toBe(text)
    expect(wrapper.find('button').text()).toBe('Copy')
  })
})
