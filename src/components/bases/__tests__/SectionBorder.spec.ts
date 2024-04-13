import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionBorder from '@/components/bases/SectionBorder.vue'

const propDefaults = { borderColourClass: 'border-neutral-500' }

describe('SectionBorder', () => {
  it('renders properly with default classes', () => {
    const wrapper = mount(SectionBorder, {
      props: { borderColourClass: propDefaults.borderColourClass },
    })

    expect(wrapper.find('section').classes()).toContain(propDefaults.borderColourClass)
  })

  it('renders properly with non-default classes', () => {
    const expected = 'border-sky-500'
    const unexpected = propDefaults.borderColourClass

    const wrapper = mount(SectionBorder, { props: { borderColourClass: expected } })

    expect(wrapper.find('section').classes()).toContain(expected)
    expect(wrapper.find('section').classes()).not.toContain(unexpected)
  })
})
