import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { DateImpreciseLabelled, Record } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'
import { getLicence } from '@/lib/data'

import Citation from '@/components/sections/elements/Citation.vue'

import collectionsData from '@/data/collections.json'

const identifier = '12345'
const doiIdentifier = `123/${identifier}`

const recordDatasetOpen: Record = {
  fileIdentifier: identifier,
  resourceType: ResourceType.Dataset,
  identifiers: [
    { identifier: doiIdentifier, href: `https://doi.org/${doiIdentifier}`, namespace: 'doi' },
  ] as Identifier[],
  edition: '1',
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
  collections: [],
}

const recordDatasetClosed = structuredClone(recordDatasetOpen)
recordDatasetClosed.licence = getLicence('X_ALL_RIGHTS_RESERVED_1')

const recordProduct = structuredClone(recordDatasetOpen)
recordProduct.resourceType = ResourceType.Product

describe('Citation', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expected = 'Citation'

    const wrapper = mount(Citation, {
      props: { record: recordDatasetOpen },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // fill in input
    await wrapper.find('textarea#citation-input').setValue(expected)

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
      props: { record: recordDatasetOpen },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('div#citation-preview').html()).toContain(
      `<i>${recordDatasetOpen.title}</i>`
    )
  })

  it('copies citation preview to input', async () => {
    const wrapper = mount(Citation, {
      props: { record: recordDatasetOpen },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.vm.$nextTick()

    wrapper.find('button#citation-use-generated').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toContain(`_${recordDatasetOpen.title}_`)
  })

  it('switches publisher when open access changes', async () => {
    const initialPublisherName = 'UK Polar Data Centre'
    const updatedPublisherName = 'Mapping and Geographic Information Centre'

    const wrapper = mount(Citation, {
      props: { record: recordDatasetOpen },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('div#citation-preview').html()).toContain(initialPublisherName)

    // change licence via record
    await wrapper.setProps({ record: recordDatasetClosed })

    expect(wrapper.find('div#citation-preview').html()).toContain(updatedPublisherName)
  })

  it('uses the correct default template for open datasets', async () => {
    const wrapper = mount(Citation, {
      props: { record: recordDatasetOpen },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    // select input with id #citation-template should be set to 'Dataset (PDC)'
    expect((wrapper.find('select#citation-template').element as HTMLSelectElement).value).toBe(
      'Dataset (PDC)'
    )
  })

  it('uses the correct default template for closed datasets', async () => {
    const wrapper = mount(Citation, {
      props: { record: recordDatasetClosed },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    // select input with id #citation-template should be set to 'Dataset (MAGIC)'
    expect((wrapper.find('select#citation-template').element as HTMLSelectElement).value).toBe(
      'Dataset (MAGIC)'
    )
  })

  it('uses the correct default template for products without collections', async () => {
    const wrapper = mount(Citation, {
      props: { record: recordProduct },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    // select input with id #citation-template should be set to 'Product (Map, MAGIC, General)'
    expect((wrapper.find('select#citation-template').element as HTMLSelectElement).value).toBe(
      'Product (Map, MAGIC, General)'
    )
  })

  it('uses the correct default template for products in MAGIC general maps collection', async () => {
    const recordOveride = structuredClone(recordProduct)
    recordOveride.collections = [
      collectionsData.collections['d0d91e22_18c1_4c7f_8dfc_20e94cd2c107'],
    ]

    const wrapper = mount(Citation, {
      props: { record: recordOveride },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    // select input with id #citation-template should be set to 'Product (Map, MAGIC, General)'
    expect((wrapper.find('select#citation-template').element as HTMLSelectElement).value).toBe(
      'Product (Map, MAGIC, General)'
    )
  })

  it('uses the correct default template for products in MAGIC published maps collection', async () => {
    const recordOveride = structuredClone(recordProduct)
    recordOveride.collections = [
      collectionsData.collections['6f5102ae_dfae_4d72_ad07_6ce4c85f5db8'],
    ]

    const wrapper = mount(Citation, {
      props: { record: recordOveride },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    // select input with id #citation-template should be set to 'Product (Map, MAGIC, Published)'
    expect((wrapper.find('select#citation-template').element as HTMLSelectElement).value).toBe(
      'Product (Map, MAGIC, Published)'
    )
  })

  it('updates citation preview if citation template changes', async () => {
    const wrapper = mount(Citation, {
      props: { record: recordProduct },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    await wrapper.vm.$nextTick()

    const templateOptionInitial = (
      wrapper.find('select#citation-template').element as HTMLSelectElement
    ).value
    expect(wrapper.find('div#citation-preview').html()).toContain(
      'Produced by the Mapping and Geographic Information Centre,'
    )

    // change citation-template select to 'Product (Map, MAGIC, Published)'
    await wrapper.find('select#citation-template').setValue('Product (Map, MAGIC, Published)')
    await wrapper.vm.$nextTick()

    const templateOptionUpdated = (
      wrapper.find('select#citation-template').element as HTMLSelectElement
    ).value
    expect(wrapper.find('div#citation-preview').html()).toContain('sheet ')
    expect(templateOptionInitial).not.toBe(templateOptionUpdated)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
