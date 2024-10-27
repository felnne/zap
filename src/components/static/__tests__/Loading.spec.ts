import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Loading from '@/components/static/Loading.vue'

describe('AppTitle', () => {
  it('renders properly', () => {
    const wrapper = mount(Loading)
    expect(wrapper.text()).toContain('🤩')
  })
})
