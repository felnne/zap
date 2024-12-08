import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Abstract from '@/components/sections/elements/Abstract.vue'

describe('Abstract', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expected = 'Abstract'

    const wrapper = mount(Abstract, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(expected)
    expect(inputElement.element.value).toBe(expected)

    await wrapper.vm.$nextTick()

    const emittedAbstract: unknown[][] | undefined = wrapper.emitted('update:abstract')
    expect(emittedAbstract).toBeTruthy()
    if (emittedAbstract) {
      expect(emittedAbstract[0][0]).toEqual(expected)
    }

    const emittedIsoAbstract: unknown[][] | undefined = wrapper.emitted('update:isoAbstract')
    expect(emittedIsoAbstract).toBeTruthy()
    if (emittedIsoAbstract) {
      expect(emittedIsoAbstract[0][0]).toEqual(expected)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
