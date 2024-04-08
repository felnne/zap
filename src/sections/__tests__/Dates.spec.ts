import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { DateImpreciseLabelled } from '@/types/app'
import Dates from '@/sections/Dates.vue'

const label = 'publication'
const impreciseValue = '0'
const expectedInitialDateValue = new Date()
expectedInitialDateValue.setHours(0, 0, 0, 0)

const expectedInitialDateIsoValue = expectedInitialDateValue.toISOString().split('T')[0]
const expectedInitialEmittedDateIsoValue = { [label]: expectedInitialDateIsoValue }
const expectedInitial: DateImpreciseLabelled[] = [
  {
    label: label,
    date: { js: expectedInitialDateValue, iso: expectedInitialDateIsoValue, precision: 'day' },
  },
]

describe('Dates', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('sets correct default values', async () => {
    const wrapper = mount(Dates, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const yearElement = wrapper.find('input#date-year')
    expect((yearElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getFullYear().toString()
    )

    const monthElement = wrapper.find('input#date-month')
    expect((monthElement.element as HTMLInputElement).value).toBe(
      (expectedInitialDateValue.getMonth() + 1).toString()
    )

    const dayElement = wrapper.find('input#date-day')
    expect((dayElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getDate().toString()
    )
  })

  it('emits values when mounted', async () => {
    const wrapper = mount(Dates, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedDates: unknown[][] | undefined = wrapper.emitted('update:dates')
    expect(emittedDates).toBeTruthy()
    if (emittedDates) {
      expect(emittedDates[0][0]).toEqual(expectedInitial)
    }

    const emittedIsoDates: unknown[][] | undefined = wrapper.emitted('update:isoDates')
    expect(emittedIsoDates).toBeTruthy()
    if (emittedIsoDates) {
      expect(emittedIsoDates[0][0]).toEqual(expectedInitialEmittedDateIsoValue)
    }
  })

  it('emits value when year is updated', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(0, 0, 0, 0)
    expectedUpdatedDateValue.setFullYear(expectedUpdatedDateValue.getFullYear() - 1)

    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('T')[0]
    const expectedUpdatedEmittedDateIsoValue = { [label]: expectedUpdatedDateIsoValue }
    const expectedUpdated: DateImpreciseLabelled[] = [
      {
        label: label,
        date: { js: expectedUpdatedDateValue, iso: expectedUpdatedDateIsoValue, precision: 'day' },
      },
    ]

    const wrapper = mount(Dates, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial value

    const emittedDates: unknown[][] | undefined = wrapper.emitted('update:dates')
    expect(emittedDates).toBeTruthy()
    if (emittedDates) {
      expect(emittedDates[0][0]).toEqual(expectedInitial)
    }

    const emittedIsoDates: unknown[][] | undefined = wrapper.emitted('update:isoDates')
    expect(emittedIsoDates).toBeTruthy()
    if (emittedIsoDates) {
      expect(emittedIsoDates[0][0]).toEqual(expectedInitialEmittedDateIsoValue)
    }

    // decrement year value

    const inputElement = wrapper.find('input#date-year')
    expect((inputElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getFullYear().toString()
    )

    await inputElement.setValue(expectedUpdatedDateValue.getFullYear().toString())
    expect((inputElement.element as HTMLInputElement).value).toBe(
      expectedUpdatedDateValue.getFullYear().toString()
    )

    await wrapper.vm.$nextTick()

    // updated value

    if (emittedDates) {
      expect(emittedDates[1][0]).toEqual(expectedUpdated)
    }
    if (emittedIsoDates) {
      expect(emittedIsoDates[1][0]).toEqual(expectedUpdatedEmittedDateIsoValue)
    }
  })

  it('computes correct date at year precision', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(0, 0, 0, 0)
    expectedUpdatedDateValue.setMonth(0)
    expectedUpdatedDateValue.setDate(1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('-')[0]
    const expectedUpdated: DateImpreciseLabelled[] = [
      {
        label: label,
        date: { js: expectedUpdatedDateValue, iso: expectedUpdatedDateIsoValue, precision: 'year' },
      },
    ]

    const wrapper = mount(Dates, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    const emittedDates: unknown[][] | undefined = wrapper.emitted('update:dates')

    // only need to set the month to unknown as we don't allow day to be set without month
    const inputElement = wrapper.find('input#date-month')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDates).toBeTruthy()
    if (emittedDates) {
      expect(emittedDates[1][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at month precision', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(0, 0, 0, 0)
    expectedUpdatedDateValue.setDate(1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue
      .toISOString()
      .split('-')
      .slice(0, 2)
      .join('-')
    const expectedUpdated: DateImpreciseLabelled[] = [
      {
        label: label,
        date: {
          js: expectedUpdatedDateValue,
          iso: expectedUpdatedDateIsoValue,
          precision: 'month',
        },
      },
    ]

    const wrapper = mount(Dates, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    const emittedDates: unknown[][] | undefined = wrapper.emitted('update:dates')

    const inputElement = wrapper.find('input#date-day')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDates).toBeTruthy()
    if (emittedDates) {
      expect(emittedDates[1][0]).toEqual(expectedUpdated)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
