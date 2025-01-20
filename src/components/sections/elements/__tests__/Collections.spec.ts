import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Collection } from '@/types/app'
import type { Aggregation } from '@/types/iso'
import { createItemCollectionAggregation } from '@/lib/aggregations'
import Collections from '@/components/sections/elements/Collections.vue'

import collectionsData from '@/data/collections.json'

describe('Collections', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders collections as choices', async () => {
    const expectedCollections: Collection[] = Object.values(collectionsData.collections)

    const wrapper = mount(Collections, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expectedCollections.every((collection) =>
      expect(wrapper.find(`input#collection-${collection.slug}`).exists()).toBeTruthy()
    )
  })

  it('renders collection for single choice', async () => {
    const collection: Collection = Object.values(collectionsData.collections)[0]

    const wrapper = mount(Collections, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set checkbox input with id 'collection-d0d91e22_18c1_4c7f_8dfc_20e94cd2c107' to checked
    await wrapper.find(`input#collection-${collection.slug}`).setValue()

    expect(wrapper.find('pre').text()).toContain(collection.identifier)
  })

  it('renders contacts for multiple choices', async () => {
    const collectionA: Collection = Object.values(collectionsData.collections)[0]
    const collectionB: Collection = Object.values(collectionsData.collections)[1]

    const wrapper = mount(Collections, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set first two collections to checked
    await wrapper.find(`input#collection-${collectionA.slug}`).setValue()
    await wrapper.find(`input#collection-${collectionB.slug}`).setValue()
    expect(wrapper.find('pre').text()).toContain(collectionA.identifier)
    expect(wrapper.find('pre').text()).toContain(collectionB.identifier)

    // uncheck first contact
    await wrapper.find(`input#collection-${collectionA.slug}`).setValue(false)
    expect(wrapper.find('pre').text()).not.toContain(collectionA.identifier)
    expect(wrapper.find('pre').text()).toContain(collectionB.identifier)
  })

  it('emits values when updated', async () => {
    const collectionA: Collection = Object.values(collectionsData.collections)[0]
    const collectionB: Collection = Object.values(collectionsData.collections)[1]
    const aggregationA: Aggregation = createItemCollectionAggregation(collectionA)
    const aggregationB: Aggregation = createItemCollectionAggregation(collectionB)

    const wrapper = mount(Collections, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.find(`input#collection-${collectionA.slug}`).setValue()
    await wrapper.vm.$nextTick()

    const emittedCollections = wrapper.emitted('update:collections') as Collection[][][]
    expect(emittedCollections).toBeTruthy()
    if (emittedCollections[0]) {
      expect(emittedCollections[0][0][0]).toEqual(collectionA)
    }
    const emittedIsoAggregations = wrapper.emitted('update:isoAggregations') as Aggregation[][][]
    expect(emittedIsoAggregations).toBeTruthy()
    if (emittedIsoAggregations[0]) {
      expect(emittedIsoAggregations[0][0][0]).toEqual(aggregationA)
    }

    // update selection, entirely replacing previous selection
    await wrapper.find(`input#collection-${collectionB.slug}`).setValue()
    await wrapper.find(`input#collection-${collectionA.slug}`).setValue(false)
    await wrapper.vm.$nextTick()

    // index 2 because index 1 is both contacts selected
    if (emittedCollections[2]) {
      expect(emittedCollections[2][0][0]).toEqual(collectionB)
    }
    if (emittedIsoAggregations[2]) {
      expect(emittedIsoAggregations[2][0][0]).toEqual(aggregationB)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
