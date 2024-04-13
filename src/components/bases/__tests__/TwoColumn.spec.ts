import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TwoColumn from '@/components/bases/TwoColumn.vue'

describe('TwoColumn', () => {
  it('renders properly', () => {
    const wrapper = mount(TwoColumn, { slots: { left: 'Left', right: 'Right' } })

    expect(wrapper.text()).toBe('LeftRight')
  })
})
