import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { TemporalExtent as TemporalExtentT } from '@/types/iso'
import TemporalExtent from '@/components/sections/elements/TemporalExtent.vue'

const referenceDate = new Date(2004, 4, 18, 3, 0, 0, 0)
const expectedInitialDateIsoValue = referenceDate.toISOString().split('T')[0]

describe('TemporalExtent', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)

    // Freeze time
    vi.useFakeTimers()
    vi.setSystemTime(referenceDate)
  })

  it('does not emit value when mounted', async () => {
    const wrapper = mount(TemporalExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedIsoExtentTemporal: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentTemporal'
    )
    expect(emittedIsoExtentTemporal).not.toBeTruthy()
  })

  it('emits value when start enabled', async () => {
    const expectedExtentTemporal: TemporalExtentT = {
      period: {
        start: expectedInitialDateIsoValue!,
      },
    }

    const wrapper = mount(TemporalExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // check input with #date-start-selection
    await wrapper.find('input#date-start-selection').setValue()

    expect(wrapper.find('#extent-temporal pre').text()).toBe(
      JSON.stringify(expectedExtentTemporal, null, 2)
    )

    const emittedIsoExtentTemporal: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentTemporal'
    )
    expect(emittedIsoExtentTemporal).toBeTruthy()
    if (emittedIsoExtentTemporal && emittedIsoExtentTemporal[0]) {
      expect(emittedIsoExtentTemporal[0][0]).toEqual(expectedExtentTemporal)
    }
  })

  it('emits value when updated', async () => {
    const expectedExtentTemporalInitial: TemporalExtentT = {
      period: {
        start: expectedInitialDateIsoValue!,
      },
    }

    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(3, 0, 0, 0)
    expectedUpdatedDateValue.setFullYear(expectedUpdatedDateValue.getFullYear() - 1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('T')[0]
    const expectedExtentTemporalUpdated: TemporalExtentT = {
      period: {
        start: expectedUpdatedDateIsoValue!,
      },
    }

    const wrapper = mount(TemporalExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // check input with #date-start-selection
    await wrapper.find('input#date-start-selection').setValue()

    const inputElement = wrapper.find('input#date-start-year')
    expect((inputElement.element as HTMLInputElement).value).toBe(
      referenceDate.getFullYear().toString()
    )

    const emittedIsoExtentTemporal: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentTemporal'
    )
    expect(emittedIsoExtentTemporal).toBeTruthy()
    if (emittedIsoExtentTemporal && emittedIsoExtentTemporal[0]) {
      expect(emittedIsoExtentTemporal[0][0]).toEqual(expectedExtentTemporalInitial)
    }

    // decrement year value

    await inputElement.setValue(expectedUpdatedDateValue.getFullYear().toString())
    expect((inputElement.element as HTMLInputElement).value).toBe(
      expectedUpdatedDateValue.getFullYear().toString()
    )

    await wrapper.vm.$nextTick()

    if (emittedIsoExtentTemporal && emittedIsoExtentTemporal[1]) {
      expect(emittedIsoExtentTemporal[1][0]).toEqual(expectedExtentTemporalUpdated)
    }
  })

  it('emits value when beginning and end enabled', async () => {
    const expectedExtentTemporal: TemporalExtentT = {
      period: {
        start: expectedInitialDateIsoValue!,
        end: expectedInitialDateIsoValue!,
      },
    }

    const wrapper = mount(TemporalExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // check input with #date-start-selection
    await wrapper.find('input#date-start-selection').setValue()

    // check input with #date-end-selection
    await wrapper.find('input#date-end-selection').setValue()

    expect(wrapper.find('#extent-temporal pre').text()).toBe(
      JSON.stringify(expectedExtentTemporal, null, 2)
    )

    const emittedIsoExtentTemporal: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentTemporal'
    )
    expect(emittedIsoExtentTemporal).toBeTruthy()
    if (emittedIsoExtentTemporal && emittedIsoExtentTemporal[1]) {
      expect(emittedIsoExtentTemporal[1][0]).toEqual(expectedExtentTemporal)
    }
  })

  it('emits undefined value when beginning deselected', async () => {
    const wrapper = mount(TemporalExtent, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // check input with #date-start-selection
    await wrapper.find('input#date-start-selection').setValue()

    // check input with #date-end-selection
    await wrapper.find('input#date-end-selection').setValue()

    // uncheck input with #date-start-selection
    await wrapper.find('input#date-start-selection').setValue(false)

    const emittedIsoExtentTemporal: unknown[][] | undefined = wrapper.emitted(
      'update:isoExtentTemporal'
    )
    expect(emittedIsoExtentTemporal).toBeTruthy()
    if (emittedIsoExtentTemporal && emittedIsoExtentTemporal[2]) {
      expect(emittedIsoExtentTemporal[2][0]).toEqual(undefined)
    }
  })

  // can't check if end is disabled when beginning deselected because can't check child component props or markup

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)

    // Restores time
    vi.useRealTimers()
  })
})
