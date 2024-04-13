import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Edition from '@/components/sections/elements/Edition.vue'

describe('Edition', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits values when mounted', async () => {
    const expected = '1.0'

    const wrapper = mount(Edition, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedEdition: unknown[][] | undefined = wrapper.emitted('update:edition')
    expect(emittedEdition).toBeTruthy()
    if (emittedEdition) {
      expect(emittedEdition[0][0]).toEqual(expected)
    }

    const emittedIsoEdition: unknown[][] | undefined = wrapper.emitted('update:isoEdition')
    expect(emittedIsoEdition).toBeTruthy()
    if (emittedIsoEdition) {
      expect(emittedIsoEdition[0][0]).toEqual(expected)
    }
  })

  it('emits values when updated', async () => {
    const expectedInitial = '1.0'
    const expectedUpdated = '2.0'

    const wrapper = mount(Edition, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value
    const emittedEdition: unknown[][] | undefined = wrapper.emitted('update:edition')
    expect(emittedEdition).toBeTruthy()
    if (emittedEdition) {
      expect(emittedEdition[0][0]).toEqual(expectedInitial)
    }
    const emittedIsoEdition: unknown[][] | undefined = wrapper.emitted('update:isoEdition')
    expect(emittedIsoEdition).toBeTruthy()
    if (emittedIsoEdition) {
      expect(emittedIsoEdition[0][0]).toEqual(expectedInitial)
    }

    // update value
    const inputElement = wrapper.find('input')
    expect(inputElement.element.value).toBe(expectedInitial)
    await inputElement.setValue(expectedUpdated)
    expect(inputElement.element.value).toBe(expectedUpdated)

    await wrapper.vm.$nextTick()

    // updated value
    if (emittedEdition) {
      expect(emittedEdition[1][0]).toEqual(expectedUpdated)
    }
    if (emittedIsoEdition) {
      expect(emittedIsoEdition[1][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
