import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType as ResourceTypeEM } from '@/types/enum'
import ResourceType from '@/components/sections/elements/ResourceType.vue'

describe('ResourceType', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when mounted', async () => {
    const expected = ResourceTypeEM.Dataset

    const wrapper = mount(ResourceType, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedResourceType: unknown[][] | undefined = wrapper.emitted('update:resourceType')
    expect(emittedResourceType).toBeTruthy()
    if (emittedResourceType) {
      expect(emittedResourceType[0][0]).toEqual(expected)
    }

    const emittedIsoHierarchyLevel: unknown[][] | undefined = wrapper.emitted(
      'update:isoHierarchyLevel'
    )
    expect(emittedIsoHierarchyLevel).toBeTruthy()
    if (emittedIsoHierarchyLevel) {
      expect(emittedIsoHierarchyLevel[0][0]).toEqual(expected)
    }
  })

  it('emits value when updated', async () => {
    const expectedInitial = ResourceTypeEM.Dataset
    const expectedUpdated = ResourceTypeEM.Product

    const wrapper = mount(ResourceType, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value
    const emittedResourceType: unknown[][] | undefined = wrapper.emitted('update:resourceType')
    expect(emittedResourceType).toBeTruthy()
    if (emittedResourceType) {
      expect(emittedResourceType[0][0]).toEqual(expectedInitial)
    }
    const emittedIsoHierarchyLevel: unknown[][] | undefined = wrapper.emitted(
      'update:isoHierarchyLevel'
    )
    expect(emittedIsoHierarchyLevel).toBeTruthy()
    if (emittedIsoHierarchyLevel) {
      expect(emittedIsoHierarchyLevel[0][0]).toEqual(expectedInitial)
    }

    // get the second input as 'dataset' comes after 'collection'
    const inputElement = wrapper.findAll('input').at(1)
    if (inputElement) {
      expect(inputElement.element.value).toBe(expectedInitial)
    }

    // set radio input with id 'resource-type-product' to checked
    await wrapper.find('input#resource-type-product').setValue()

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedResourceType) {
      expect(emittedResourceType[1][0]).toEqual(expectedUpdated)
    }
    if (emittedIsoHierarchyLevel) {
      expect(emittedIsoHierarchyLevel[1][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
