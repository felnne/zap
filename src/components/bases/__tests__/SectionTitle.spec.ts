import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionTitle from '@/components/bases/SectionTitle.vue'
import { Stability } from '@/types/enum'

const version = '1.0'
const anchor = 'foo-bar'
const title = 'Foo Bar'

describe('SectionTitle', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

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
    expect(wrapper.find('div.section-stability').attributes().class).toContain('text-indigo-500')
  })

  it('renders teleported content', async () => {
    const wrapper = mount(SectionTitle, {
      props: { version: version, anchor: anchor, title: title },
    })

    await wrapper.vm.$nextTick() // wait for onMount and teleport to occur

    const tocItemLink = document.querySelector('a.toc-item')
    expect(tocItemLink).not.toBeNull()
    expect(tocItemLink?.attributes.getNamedItem('href')?.value).toBe(`#${anchor}`)
  })

  it('does not render teleported content when TOC disabled', async () => {
    const wrapper = mount(SectionTitle, {
      props: { version: version, anchor: anchor, title: title, addToc: false },
    })

    await wrapper.vm.$nextTick() // wait for onMount and teleport to occur

    const tocItemLink = document.querySelector('a.toc-item')
    expect(tocItemLink).toBeNull()
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
