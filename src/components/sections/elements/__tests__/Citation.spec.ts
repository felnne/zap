import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { DateImpreciseLabelled, Record } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'
import { getPublisherOrgSlug } from '@/lib/contacts'
import { getLicence, getOrganisation } from '@/lib/data'
import Citation from '@/components/sections/elements/Citation.vue'

const identifier = '12345'
const doiIdentifier = `123/${identifier}`

const record: Record = {
  fileIdentifier: identifier,
  resourceType: ResourceType.Dataset,
  identifiers: [
    { identifier: doiIdentifier, href: `https://doi.org/${doiIdentifier}`, namespace: 'doi' },
  ] as Identifier[],
  edition: '1.0',
  dates: [
    {
      date: { js: new Date(2014, 0, 20), iso: '2014-01-20', precision: 'day' },
      label: 'publication',
    },
  ] as DateImpreciseLabelled[],
  contacts: [{ individual: { name: 'Watson, C.' } }] as Contact[],
  title: 'test',
  abstract: 'test',
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

  it('emits value when updated', async () => {
    const expected = 'Citation'

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

    // fill in input
    wrapper.find('textarea#citation-input').setValue(expected)

    await flushPromises()

    const emittedIsoOtherCitationDetails: unknown[][] | undefined = wrapper.emitted(
      'update:isoOtherCitationDetails'
    )
    expect(emittedIsoOtherCitationDetails).toBeTruthy()
    if (emittedIsoOtherCitationDetails) {
      expect(emittedIsoOtherCitationDetails[0][0]).toEqual(expected)
    }
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

    wrapper.find('button#citation-use-generated').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toContain(`_${record.title}_`)
  })

  it('switches publisher when open access changes', async () => {
    const initialPublisher = getOrganisation(
      getPublisherOrgSlug(record.resourceType, record.licence)
    )

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

    expect(wrapper.find('div#citation-preview').html()).toContain(initialPublisher.name)

    // change licence prop
    const updatedRecord = { ...record, licence: getLicence('X_FAKE_CLOSED') }
    await wrapper.setProps({ record: updatedRecord })
    const updatedPublisher = getOrganisation(
      getPublisherOrgSlug(updatedRecord.resourceType, updatedRecord.licence)
    )

    // getCitation() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    expect(wrapper.find('div#citation-preview').html()).toContain(updatedPublisher.name)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
