import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { DateImpreciseLabelled, Record } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'
import { getLicence } from '@/utils/data'
import Citation from '@/sections/Citation.vue'

const identifier = '12345'
const doiIdentifier = `123/${identifier}`

const record: Record = {
  fileIdentifier: identifier,
  resourceType: ResourceType.Dataset,
  identifiers: [
    { identifier: doiIdentifier, href: `https://doi.org/${doiIdentifier}`, title: 'doi' },
  ] as Identifier[],
  edition: '1.0',
  dates: [
    {
      date: { js: new Date(2014, 0, 20), iso: '2014-01-20', precision: 'day' },
      label: 'published',
    },
  ] as DateImpreciseLabelled[],
  contacts: [{ individual: { name: 'Watson, C.' } }] as Contact[],
  title: 'test',
  accessRestriction: {
    slug: 'other',
    restriction: 'access',
    label: 'Other access restriction',
    permissions: [],
  },
  licence: getLicence('OGL_UK_3_0'),
}

describe('Citation', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders properly', async () => {
    const wrapper = mount(Citation, {
      props: { record: record },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // getCitation() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    expect(wrapper.find('div#citation-preview').html()).toContain(`<i>${record.title}</i>`)
  })

  it('copies citation preview to input', async () => {
    const wrapper = mount(Citation, {
      props: { record: record },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // getCitation() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toContain(`_${record.title}_`)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
