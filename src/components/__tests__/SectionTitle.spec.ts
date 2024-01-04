import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionTitle from '@/components/SectionTitle.vue'
import type { TocItem } from '@/types/app'

const anchor = 'foo-bar'
const title = 'Foo Bar'

describe('SectionTitle', () => {
  it('renders properly with subtitle and guidance', async () => {
    const subTitle = 'Baz'
    const guidanceHref = 'https://example.com'

    const wrapper = mount(SectionTitle, {
      props: { anchor: anchor, title: title, subTitle: subTitle, guidanceHref: guidanceHref }
    })

    expect(wrapper.find('h2').attributes().id).toBe(anchor)
    expect(wrapper.find('h2').text()).toBe(title)
    expect(wrapper.find('h3').text()).toBe(subTitle)
    expect(wrapper.find('a.section-top').attributes().href).toBe('#top')
    expect(wrapper.find('a.section-guidance').attributes().href).toBe(guidanceHref)
  })

  it('renders properly without subtitle and guidance', async () => {
    const wrapper = mount(SectionTitle, {
      props: { anchor: anchor, title: title }
    })

    expect(wrapper.find('h2').attributes().id).toBe(anchor)
    expect(wrapper.find('h2').text()).toBe(title)
    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.find('a.section-top').attributes().href).toBe('#top')
    expect(wrapper.find('a.section-guidance').exists()).toBe(false)
  })

  it('emits toc item', async () => {
    const expected: TocItem = {
      anchor: anchor,
      title: title
    }

    const wrapper = mount(SectionTitle, {
      props: { anchor: anchor, title: title }
    })

    const emittedTocItem = wrapper.emitted('update:tocItems')
    expect(emittedTocItem).toBeTruthy()
    if (emittedTocItem) {
      expect(emittedTocItem[0]).toEqual([expected])
    }
  })
})
