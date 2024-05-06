import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Summary from '@/components/sections/elements/Summary.vue'

describe('Summary', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expectedUpdated = 'Summary'

    const wrapper = mount(Summary, {
      props: {
        abstract: '',
      },
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

    const emittedSummary: unknown[][] | undefined = wrapper.emitted('update:summary')
    expect(emittedSummary).toBeTruthy()
    if (emittedSummary) {
      expect(emittedSummary[0][0]).toEqual(expectedUpdated)
    }

    const emittedIsoValuePurpose: unknown[][] | undefined = wrapper.emitted('update:isoPurpose')
    expect(emittedIsoValuePurpose).toBeTruthy()
    if (emittedIsoValuePurpose) {
      expect(emittedIsoValuePurpose[0][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
