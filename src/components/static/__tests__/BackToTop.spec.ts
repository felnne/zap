import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BackToTop from '@/components/static/BackToTop.vue'

describe('BackToTop', () => {
  it('renders properly', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.attributes().id).toBe('top')
  })
})
