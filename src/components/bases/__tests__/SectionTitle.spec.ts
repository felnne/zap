import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { Stability, SectionType } from '@/types/enum'
import type { DropdownItem } from '@/types/app'
import { getSetting } from '@/lib/data'

import SectionTitle from '@/components/bases/SectionTitle.vue'

const version = '1.0'
const anchor = 'foo-bar'
const title = 'Foo Bar'

describe('SectionTitle', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders properly', async () => {
    const subTitle = 'Baz'
    const dataFileHref = ['data-file.json']
    const dependantSections: DropdownItem[] = [{ title: 'Something', href: '#something' }]
    const expectedGuidanceHref = 'https://example.com/guidance.html'
    const expectedDataFileHref = `${getSetting('app_section_data_file_url_base')}/${dataFileHref[0]}`
    const expectedDependantSectionHref = dependantSections[0]!.href

    const wrapper = mount(SectionTitle, {
      props: {
        type: SectionType.Element,
        version: version,
        anchor: anchor,
        title: title,
        subTitle: subTitle,
        guidanceHref: expectedGuidanceHref,
        dataFileHref: dataFileHref,
        dependsOn: dependantSections,
      },
    })

    expect(wrapper.find('h2').attributes().id).toBe(anchor)
    expect(wrapper.find('h2').text()).toBe(title)
    expect(wrapper.find('h3').text()).toBe(subTitle)
    expect(wrapper.find('div.section-version').text()).toBe(version)
    expect(wrapper.find('div.section-stability').text()).toBe(Stability.Stable)
    expect(wrapper.find('div.section-stability').attributes().class).toContain('text-green-500')
    expect(wrapper.find('a.section-top').attributes().href).toBe('#top')
    expect(wrapper.find('a.section-guidance').attributes().href).toBe(expectedGuidanceHref)

    // click trigger to open dropdowns
    const dataFilesButton = wrapper.findAll('button').filter((e) => e.text().match('Data Files'))[0]
    dataFilesButton?.trigger('click')
    const dependsOnButton = wrapper.findAll('button').filter((e) => e.text().match('Depends On'))[0]
    dependsOnButton?.trigger('click')
    // wait for next tick to allow transitions to complete
    await wrapper.vm.$nextTick()

    expect(wrapper.find('a.section-data-file').attributes().href).toBe(expectedDataFileHref)
    expect(wrapper.find('a.section-depends-on').attributes().href).toBe(
      expectedDependantSectionHref
    )
  })

  it('renders properly without subtitle, guidance, data files or dependant sections', async () => {
    const wrapper = mount(SectionTitle, {
      props: { type: SectionType.Element, version: version, anchor: anchor, title: title },
    })

    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.find('a.section-guidance').exists()).toBe(false)
    expect(wrapper.find('a.section-data-file').exists()).toBe(false)
    expect(wrapper.find('a.section-depends-on').exists()).toBe(false)
  })

  it('renders properly with experimental stability', async () => {
    const wrapper = mount(SectionTitle, {
      props: {
        type: SectionType.Element,
        version: version,
        stability: Stability.Experimental,
        anchor: anchor,
        title: title,
      },
    })

    expect(wrapper.find('div.section-stability').text()).toBe(Stability.Experimental)
    expect(wrapper.find('div.section-stability').attributes().class).toContain('text-indigo-500')
  })

  it('renders teleported content', async () => {
    const wrapper = mount(SectionTitle, {
      props: { type: SectionType.Element, version: version, anchor: anchor, title: title },
    })

    await wrapper.vm.$nextTick() // wait for onMount and teleport to occur

    const tocItemLink = document.querySelector('a.toc-item')
    expect(tocItemLink).not.toBeNull()
    expect(tocItemLink?.attributes.getNamedItem('href')?.value).toBe(`#${anchor}`)
  })

  it('does not render teleported content when TOC disabled', async () => {
    const wrapper = mount(SectionTitle, {
      props: {
        type: SectionType.Element,
        version: version,
        anchor: anchor,
        title: title,
        addToc: false,
      },
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
