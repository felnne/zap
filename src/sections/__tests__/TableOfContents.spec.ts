import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TableOfContents from '@/sections/TableOfContents.vue'

describe('TableOfContents', () => {
  it('renders properly', async () => {
    const wrapper = mount(TableOfContents)

    expect(wrapper.find('#toc-items').exists()).toBeTruthy()
  })
})
