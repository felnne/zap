import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionLabel from '@/components/bases/SectionLabel.vue'

const propDefaults = { textColourClass: 'text-neutral-500' }

describe('SectionLabel', () => {
  it('renders properly with default classes', async () => {
    const wrapper = mount(SectionLabel)

    expect(wrapper.find('label').classes()).toContain(propDefaults.textColourClass)
  })

  it('renders properly with non-default classes', async () => {
    const expected = 'text-sky-500'
    const wrapper = mount(SectionLabel, { props: { textColourClass: expected } })

    expect(wrapper.find('label').classes()).toContain(expected)
    expect(wrapper.find('label').classes()).not.toContain(propDefaults.textColourClass)
  })
})
