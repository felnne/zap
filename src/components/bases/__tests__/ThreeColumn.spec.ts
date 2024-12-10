import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ThreeColumn from '@/components/bases/ThreeColumn.vue'

describe('ThreeColumn', () => {
  it('renders properly', () => {
    const wrapper = mount(ThreeColumn, {
      slots: { left: 'Left', middle: 'Middle', right: 'Right' },
    })

    expect(wrapper.text()).toBe('LeftMiddleRight')
  })
})
