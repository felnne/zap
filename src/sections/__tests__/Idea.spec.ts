import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Idea from '@/sections/Idea.vue'

describe('Idea', () => {
  it('renders properly when completed', async () => {
    const wrapper = mount(Idea, { props: { complete: true } })

    expect(wrapper.text()).toContain('Done')
  })
})
