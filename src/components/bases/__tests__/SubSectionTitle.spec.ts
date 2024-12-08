import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SubSectionTitle from '@/components/bases/SubSectionTitle.vue'

describe('SubSectionTitle', () => {
  it('renders properly', () => {
    const wrapper = mount(SubSectionTitle, { slots: { default: 'xxx' } })

    expect(wrapper.text()).toBe('xxx')
  })
})
