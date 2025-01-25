import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Scale from '@/components/sections/elements/Scale.vue'

describe('Scale', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits values when mounted', async () => {
    const expected = '1'

    const wrapper = mount(Scale, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedIsoSpatialResolution: unknown[][] | undefined = wrapper.emitted('update:isoSpatialResolution')
    expect(emittedIsoSpatialResolution).toBeTruthy()
    if (emittedIsoSpatialResolution) {
      expect(emittedIsoSpatialResolution[0][0]).toEqual(expected)
    }
  })

  it('emits values when updated', async () => {
    const expectedInitial = '1'
    const expectedUpdated = '2'

    const wrapper = mount(Scale, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value
    const emittedIsoSpatialResolution: unknown[][] | undefined = wrapper.emitted('update:isoSpatialResolution')
    expect(emittedIsoSpatialResolution).toBeTruthy()
    if (emittedIsoSpatialResolution) {
      expect(emittedIsoSpatialResolution[0][0]).toEqual(expectedInitial)
    }

    // update value
    const inputElement = wrapper.find('input')
    expect(inputElement.element.value).toBe(expectedInitial)
    await inputElement.setValue(expectedUpdated)
    expect(inputElement.element.value).toBe(expectedUpdated)

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedIsoSpatialResolution) {
      expect(emittedIsoSpatialResolution[1][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
