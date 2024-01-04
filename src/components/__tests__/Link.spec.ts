import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Link from '@/components/Link.vue'

describe('Link', () => {
  it('renders internal link properly', () => {
    const url = '#top'

    const wrapper = mount(Link, {
      props: { href: url }
    })

    expect(wrapper.attributes().href).toBe(url)
    expect(wrapper.attributes().target).toBe('_self')
    expect(wrapper.attributes().rel).toBe(undefined)
  })

  it('renders external link properly', () => {
    const url = 'https://example.com'

    const wrapper = mount(Link, {
      props: { href: url }
    })

    expect(wrapper.attributes().href).toBe(url)
    expect(wrapper.attributes().target).toBe('_blank')
    expect(wrapper.attributes().rel).toBe('noopener noreferrer')
  })
})
