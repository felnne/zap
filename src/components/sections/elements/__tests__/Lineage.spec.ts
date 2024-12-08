import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'
import Lineage from '@/components/sections/elements/Lineage.vue'

describe('Lineage', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expected = 'Lineage'

    const wrapper = mount(Lineage, {
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

    const emittedIsoLineageStatement: unknown[][] | undefined = wrapper.emitted(
      'update:isoLineageStatement'
    )
    expect(emittedIsoLineageStatement).toBeTruthy()
    if (emittedIsoLineageStatement) {
      expect(emittedIsoLineageStatement[0][0]).toEqual(expected)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
