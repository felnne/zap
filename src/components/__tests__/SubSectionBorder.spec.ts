import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SubSectionBorder from '@/components/SubSectionBorder.vue'

const propDefaults = { borderColourClass: 'border-neutral-300 dark:border-neutral-700' }

describe('SubSectionBorder', () => {
  it('renders properly with default classes', () => {
    const wrapper = mount(SubSectionBorder, {
      props: { borderColourClass: propDefaults.borderColourClass }
    })

    propDefaults.borderColourClass
      .split(' ')
      .every((expectedClass) => expect(wrapper.find('section').classes()).toContain(expectedClass))
  })

  it('renders properly with non-default classes', () => {
    const expected = 'border-sky-500'

    const wrapper = mount(SubSectionBorder, { props: { borderColourClass: expected } })

    expect(wrapper.find('section').classes()).toContain(expected)
    propDefaults.borderColourClass
      .split(' ')
      .every((unexpectedClass) =>
        expect(wrapper.find('section').classes()).not.toContain(unexpectedClass)
      )
  })
})
