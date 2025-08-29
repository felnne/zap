import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { DateImpreciseLabelled } from '@/types/app'
import Dates from '@/components/sections/elements/Dates.vue'

const referenceDate = new Date(2004, 4, 18, 3, 0, 0, 0)
const referenceDateTime = new Date(Date.UTC(2004, 4, 18, 14, 35, 59, 0))

describe('Dates', () => {
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

  it('adds a date and emits dates', async () => {
    const expectedDate: DateImpreciseLabelled = {
      label: 'creation',
      date: {
        js: referenceDate,
        iso: referenceDate.toISOString().split('T')[0]!,
        precision: 'day',
      },
    }

    const wrapper = mount(Dates, { global: { directives: { clipboard: Clipboard } } })

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Date' })
    await childComponent.vm.$emit('add:date', expectedDate)

    expect(wrapper.find('pre').text()).toContain(expectedDate.label)
    expect(wrapper.find('pre').text()).toContain(expectedDate.date.iso)

    const emittedDates: unknown[][] | undefined = wrapper.emitted('update:dates')
    expect(emittedDates).toBeTruthy()
    if (emittedDates && emittedDates[1]) {
      expect(emittedDates[1][0]).toEqual([expectedDate])
    }

    const emittedIsoDates: unknown[][] | undefined = wrapper.emitted('update:isoDates')
    expect(emittedIsoDates).toBeTruthy()
    if (emittedIsoDates && emittedIsoDates[1]) {
      expect(emittedIsoDates[1][0]).toEqual({ [expectedDate.label]: expectedDate.date.iso })
    }
  })

  it('removes a date', async () => {
    vi.setSystemTime(referenceDateTime)

    const expectedCreationDate: DateImpreciseLabelled = {
      label: 'creation',
      date: {
        js: referenceDate,
        iso: referenceDate.toISOString().split('T')[0]!,
        precision: 'day',
      },
    }

    const expectedPublicationDate: DateImpreciseLabelled = {
      label: 'publication',
      date: {
        js: referenceDateTime,
        iso: `${referenceDateTime.toISOString()}+00:00`,
        precision: 'day',
      },
    }

    const wrapper = mount(Dates, { global: { directives: { clipboard: Clipboard } } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    // check output only initially contains creation date
    const initialOutput = JSON.stringify(
      { [expectedCreationDate.label]: expectedCreationDate.date.iso },
      null,
      2
    )
    expect(wrapper.find('pre').text()).toBe(initialOutput)

    // add identifier (needs to use a date that is not required and can emit remove:date)
    const childComponent = wrapper.findAllComponents({ name: 'Date' })[2] // is 'publication'
    if (!childComponent) {
      throw new Error('Child component not found')
    }

    await childComponent.vm.$emit('add:date', expectedPublicationDate)
    expect(wrapper.find('pre').text()).toContain(
      `"${expectedPublicationDate.label}": "${expectedPublicationDate.date.iso}"`
    )

    // then remove it and check list is as before
    await childComponent.vm.$emit('remove:date', expectedPublicationDate)
    expect(wrapper.find('pre').text()).toBe(initialOutput)
  })

  it('updates an existing identifier', async () => {
    const expectedDateInitial: DateImpreciseLabelled = {
      label: 'creation',
      date: {
        js: referenceDate,
        iso: referenceDate.toISOString().split('T')[0]!,
        precision: 'day',
      },
    }

    const updatedDate = new Date(referenceDate.setFullYear(referenceDate.getFullYear() + 1))
    const expectedDateUpdated: DateImpreciseLabelled = {
      label: 'creation',
      date: { js: updatedDate, iso: updatedDate.toISOString().split('T')[0]!, precision: 'day' },
    }

    const initialOutput = JSON.stringify(
      { [expectedDateInitial.label]: expectedDateInitial.date.iso },
      null,
      2
    )
    const updatedOutput = JSON.stringify(
      { [expectedDateUpdated.label]: expectedDateUpdated.date.iso },
      null,
      2
    )

    const wrapper = mount(Dates, { global: { directives: { clipboard: Clipboard } } })

    // initial identifier
    const childComponent = wrapper.findComponent({ name: 'Date' })
    await childComponent.vm.$emit('add:date', expectedDateInitial)
    expect(wrapper.find('pre').text()).toContain(initialOutput)

    // then remove it and re-add it with a different value (but the same label)
    await childComponent.vm.$emit('remove:date', expectedDateInitial)
    await childComponent.vm.$emit('add:date', expectedDateUpdated)

    expect(wrapper.find('pre').text()).toContain(updatedOutput)
    expect(wrapper.find('pre').text()).not.toContain(initialOutput)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)

    // Restores time
    vi.useRealTimers()
  })
})
