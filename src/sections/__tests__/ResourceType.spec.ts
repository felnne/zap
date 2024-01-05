import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import ResourceType from '@/sections/ResourceType_v1_0.vue'

describe('ResourceType', () => {
  it('emits value when mounted', async () => {
    const expected = 'dataset'

    const wrapper = mount(ResourceType, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    const emittedResourceType = wrapper.emitted('update:resourceType')
    expect(emittedResourceType).toBeTruthy()
    if (emittedResourceType) {
      expect(emittedResourceType[0]).toEqual([expected])
    }
  })

  it('emits value when updated', async () => {
    const expectedInitial = 'dataset'
    const expectedUpdated = 'product'

    const wrapper = mount(ResourceType, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // initial value
    const emittedResourceType = wrapper.emitted('update:resourceType')
    expect(emittedResourceType).toBeTruthy()
    if (emittedResourceType) {
      expect(emittedResourceType[0]).toEqual([expectedInitial])
    }

    const inputElement = wrapper.find('input')
    expect(inputElement.element.value).toBe(expectedInitial)

    // set radio input with id 'resource-type-product' to checked
    await wrapper.find('input#resource-type-product').setValue()

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedResourceType) {
      expect(emittedResourceType[1]).toEqual([expectedUpdated])
    }
  })
})
