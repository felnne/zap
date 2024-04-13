import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import ResearchTopics from '@/components/sections/elements/ResearchTopics.vue'

describe('ResearchTopics', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits values when updated', async () => {
    const expectedKeywords = [
      {
        terms: [
          {
            term: 'Utility and governmental services',
            href: 'https://www.eionet.europa.eu/gemet/en/inspire-theme/us',
          },
        ],
        type: 'theme',
        thesaurus: {
          title: {
            value: 'General Multilingual Environmental Thesaurus - INSPIRE themes',
            href: 'http://www.eionet.europa.eu/gemet/inspire_themes',
          },
          dates: { publication: '2018-08-16' },
          edition: '4.1.2',
          contact: {
            organisation: {
              name: 'European Environment Information and Observation Network (EIONET), European Environment Agency (EEA)',
              href: 'https://ror.org/02k4b9v70',
              title: 'ror',
            },
            email: 'helpdesk@eionet.europa.eu',
            online_resource: {
              href: 'https://www.eionet.europa.eu/gemet/en/themes/',
              title:
                'GEMET INSPIRE Spatial Data Themes  General Multilingual Environmental Thesaurus',
              description:
                'GEMET, the GEneral Multilingual Environmental Thesaurus, has been developed as a multilingual thesauri for indexing, retrieval and control of terms in order to save time, energy and funds.',
              function: 'information',
            },
            role: ['publisher'],
          },
        },
      },
      {
        terms: [
          {
            term: 'Living and working in Antarctica',
            href: 'http://vocab.nerc.ac.uk/collection/T01/current/0d6365f7-7f89-41fa-bb14-b42023d1f08b/1/',
          },
        ],
        type: 'theme',
        thesaurus: {
          title: {
            value: 'British Antarctic Survey research topics',
            href: 'http://vocab.nerc.ac.uk/collection/T01/current/',
          },
          dates: { publication: '2020-05-06' },
          edition: '1',
          contact: {
            organisation: {
              name: 'UK Polar Data Centre, Natural Environment Research Council',
              href: 'https://ror.org/02b5d8509',
              title: 'ror',
            },
            phone: '+44 (0)1223 221400',
            address: {
              delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
              city: 'Cambridge',
              administrative_area: 'Cambridgeshire',
              postal_code: 'CB3 0ET',
              country: 'United Kingdom',
            },
            email: 'polardatacentre@bas.ac.uk',
            online_resource: {
              href: 'https://www.bas.ac.uk/team/business-teams/information-services/uk-polar-data-centre/',
              title: 'UK Polar Data Centre (UK PDC) - BAS public website',
              description:
                'General information about the UK Polar Data Centre (UK PDC) from the British Antarctic Survey (BAS) public website.',
              function: 'information',
            },
            role: ['publisher'],
          },
        },
      },
    ]
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

    await wrapper.vm.$nextTick()

    const emittedIsoKeywords: unknown[][] | undefined = wrapper.emitted('update:isoKeywords')
    expect(emittedIsoKeywords).toBeTruthy()
    if (emittedIsoKeywords) {
      expect(emittedIsoKeywords[0][0]).toEqual(expectedKeywords)
    }

    const emittedIsoTopics: unknown[][] | undefined = wrapper.emitted('update:isoTopics')
    expect(emittedIsoTopics).toBeTruthy()
    if (emittedIsoTopics) {
      expect(emittedIsoTopics[0][0]).toEqual([expectedTopic])
    }
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
