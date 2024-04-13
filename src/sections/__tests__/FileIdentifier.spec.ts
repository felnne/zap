import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import FileIdentifier from '@/sections/FileIdentifier.vue'

describe('FileIdentifier', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits values when mounted', async () => {
    const uuidv4Regex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-4[0-9a-fA-F]{3}\b-[89abAB][0-9a-fA-F]{3}\b-[0-9a-fA-F]{12}\b$/

    const wrapper = mount(FileIdentifier, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedFileIdentifier: unknown[][] | undefined = wrapper.emitted('update:fileIdentifier')
    expect(emittedFileIdentifier).toBeTruthy()
    if (emittedFileIdentifier) {
      expect(typeof emittedFileIdentifier[0][0]).toBe('string')
      if (typeof emittedFileIdentifier[0][0] === 'string') {
        expect(uuidv4Regex.test(emittedFileIdentifier[0][0])).toBe(true)
      }
    }

    const emittedIsoFileIdentifier: unknown[][] | undefined = wrapper.emitted(
      'update:isoFileIdentifier'
    )
    expect(emittedIsoFileIdentifier).toBeTruthy()
    if (emittedIsoFileIdentifier) {
      expect(typeof emittedIsoFileIdentifier[0][0]).toBe('string')
      if (typeof emittedIsoFileIdentifier[0][0] === 'string') {
        expect(uuidv4Regex.test(emittedIsoFileIdentifier[0][0])).toBe(true)
      }
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
