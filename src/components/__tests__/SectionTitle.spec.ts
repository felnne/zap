import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionTitle from '@/components/SectionTitle.vue'
import type { TocItem } from '@/types/app'
import { Stability } from '@/types/enum'

const version = '1.0'
const anchor = 'foo-bar'
const title = 'Foo Bar'

describe('SectionTitle', () => {
  it('renders properly', async () => {
    const subTitle = 'Baz'
    const guidanceHref = 'https://example.com'

    const wrapper = mount(SectionTitle, {
      props: {
        version: version,
        anchor: anchor,
        title: title,
        subTitle: subTitle,
        guidanceHref: guidanceHref,
      },
    })

    expect(wrapper.find('h2').attributes().id).toBe(anchor)
    expect(wrapper.find('h2').text()).toBe(title)
    expect(wrapper.find('h3').text()).toBe(subTitle)
    expect(wrapper.find('div.section-version').text()).toBe(version)
    expect(wrapper.find('div.section-stability').text()).toBe(Stability.Stable)
    expect(wrapper.find('div.section-stability').attributes().class).toContain('text-green-500')
    expect(wrapper.find('a.section-top').attributes().href).toBe('#top')
    expect(wrapper.find('a.section-guidance').attributes().href).toBe(guidanceHref)
  })

  it('renders properly without subtitle and guidance', async () => {
    const wrapper = mount(SectionTitle, {
      props: { version: version, anchor: anchor, title: title },
    })

    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.find('a.section-guidance').exists()).toBe(false)
  })

  it('renders properly with experimental stability', async () => {
    const wrapper = mount(SectionTitle, {
      props: { version: version, stability: Stability.Experimental, anchor: anchor, title: title },
    })

    expect(wrapper.find('div.section-stability').text()).toBe(Stability.Experimental)
    expect(wrapper.find('div.section-stability').attributes().class).toContain('text-purple-500')
  })

  it('emits toc item', async () => {
    const expected: TocItem = {
      anchor: anchor,
      title: title,
    }

    const wrapper = mount(SectionTitle, {
      props: { version: version, anchor: anchor, title: title },
    })

    const emittedTocItem = wrapper.emitted('update:tocItems')
    expect(emittedTocItem).toBeTruthy()
    if (emittedTocItem) {
      expect(emittedTocItem[0]).toEqual([expected])
    }
  })
})
