import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Abstract from '@/sections/Abstract.vue'

describe('Abstract', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expectedUpdated = 'Abstract'

    const wrapper = mount(Abstract, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(expectedUpdated)
    expect(inputElement.element.value).toBe(expectedUpdated)

    await wrapper.vm.$nextTick()

    const emittedIsoAbstract: unknown[][] | undefined = wrapper.emitted('update:isoAbstract')
    expect(emittedIsoAbstract).toBeTruthy()
    if (emittedIsoAbstract) {
      expect(emittedIsoAbstract[0][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
