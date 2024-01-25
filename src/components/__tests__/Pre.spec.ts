import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Pre from '@/components/Pre.vue'

describe('Pre', () => {
  it('renders properly', () => {
    const text = 'text'

    const wrapper = mount(Pre, { slots: { default: text } })

    expect(wrapper.find('pre').text()).toBe(text)
  })
})
