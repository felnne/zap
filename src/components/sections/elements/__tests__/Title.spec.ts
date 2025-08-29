import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Title from '@/components/sections/elements/Title.vue'

describe('Title', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expectedUpdated = 'Title'

    const wrapper = mount(Title, {
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

    const emittedTitle: unknown[][] | undefined = wrapper.emitted('update:title')
    expect(emittedTitle).toBeTruthy()
    if (emittedTitle && emittedTitle[0]) {
      expect(emittedTitle[0][0]).toEqual(expectedUpdated)
    }

    const emittedIsoValueTitle: unknown[][] | undefined = wrapper.emitted('update:title')
    expect(emittedIsoValueTitle).toBeTruthy()
    if (emittedIsoValueTitle && emittedIsoValueTitle[0]) {
      expect(emittedIsoValueTitle[0][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
