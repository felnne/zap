import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import ResearchTopics from '@/sections/ResearchTopics.vue'

describe('ResearchTopics', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders research topics as choices', async () => {
    const expectedSlugs = ['living_and_working_in_antarctica', 'topographic_mapping']

    const wrapper = mount(ResearchTopics, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expectedSlugs.every((slug) => expect(wrapper.find(`input#topic-${slug}`).exists()).toBeTruthy())
  })

  it('renders keywords and topics for a single choice', async () => {
    const expectedKeywords = 'Utility and governmental services'
    const expectedTopic = 'society'

    const wrapper = mount(ResearchTopics, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'topic-living_and_working_in_antarctica' to checked
    await wrapper.find('input#topic-living_and_working_in_antarctica').setValue()

    expect(wrapper.find('#keywords pre').text()).toContain(expectedKeywords)
    expect(wrapper.find('#iso-topics pre').text()).toContain(expectedTopic)
  })

  it('renders ISO topics for multiple choices', async () => {
    const expectedTopics = ['society', 'environment']

    const wrapper = mount(ResearchTopics, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set first two topics to checked
    await wrapper.find('input#topic-living_and_working_in_antarctica').setValue()
    await wrapper.find('input#topic-topographic_mapping').setValue()

    expectedTopics.every((topic) => expect(wrapper.find('#iso-topics pre').text()).toContain(topic))
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
