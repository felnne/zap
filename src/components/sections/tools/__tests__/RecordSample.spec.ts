import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import RecordSample from '@/components/sections/tools/RecordSample.vue'

describe('RecordSample', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-tools' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-tools'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits correctly', async () => {
    const expectedTitle = 'x'
    const expectedAbstract = 'xx'
    const expectedLineage = 'xxx'

    const wrapper = mount(RecordSample)

    // click set-sample-required button
    await wrapper.find('button#set-sample-required').trigger('click')

    await wrapper.vm.$nextTick()

    const emittedIsoTitle: unknown[][] | undefined = wrapper.emitted('update:isoTitleValue')
    expect(emittedIsoTitle).toBeTruthy()
    if (emittedIsoTitle && emittedIsoTitle[0]) {
      expect(emittedIsoTitle[0][0]).toEqual(expectedTitle)
    }

    const emittedIsoAbstract: unknown[][] | undefined = wrapper.emitted('update:isoAbstract')
    expect(emittedIsoAbstract).toBeTruthy()
    if (emittedIsoAbstract && emittedIsoAbstract[0]) {
      expect(emittedIsoAbstract[0][0]).toEqual(expectedAbstract)
    }

    const emittedIsoLineage: unknown[][] | undefined = wrapper.emitted('update:isoLineageStatement')
    expect(emittedIsoLineage).toBeTruthy()
    if (emittedIsoLineage && emittedIsoLineage[0]) {
      expect(emittedIsoLineage[0][0]).toEqual(expectedLineage)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

// See also 'emits ISO record correctly when sample data is set' in Record composition test
