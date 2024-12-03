import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import type { DateImpreciseLabelled } from '@/types/app'
import DateComp from '@/components/sections/elements/Date.vue'

const referenceDate = new Date(2004, 4, 18, 3, 0, 0, 0)
const referenceDateTime = new Date(Date.UTC(2004, 4, 18, 14, 35, 59, 0))

const label = 'test'
const impreciseValue = '0'
const expectedInitialDateValue = referenceDate
const expectedInitialDateTimeValue = referenceDateTime

const expectedInitialDateIsoValue = expectedInitialDateValue.toISOString().split('T')[0]
const expectedInitialDateTimeIsoValue = expectedInitialDateTimeValue
  .toISOString()
  .replace('.000Z', '+00:00')

const expectedInitial: DateImpreciseLabelled = {
  label: label,
  date: { js: expectedInitialDateValue, iso: expectedInitialDateIsoValue, precision: 'day' },
}
const expectedInitialTime: DateImpreciseLabelled = {
  label: label,
  date: {
    js: expectedInitialDateTimeValue,
    iso: expectedInitialDateTimeIsoValue,
    precision: 'day',
  },
}

describe('Date', () => {
  beforeEach(() => {
    // Freeze time
    vi.useFakeTimers()
    vi.setSystemTime(referenceDate)
  })

  it('sets correct default values without time', async () => {
    const wrapper = mount(DateComp, { props: { label: label } })

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

    expect(wrapper.find('input#date-hour').exists()).toBe(false)
    expect(wrapper.find('input#date-minute').exists()).toBe(false)
    expect(wrapper.find('input#date-second').exists()).toBe(false)
  })

  it('sets correct default values with time', async () => {
    const wrapper = mount(DateComp, { props: { label: label, showTime: true } })

    const hourElement = wrapper.find('input#date-hour')
    expect((hourElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getUTCHours().toString()
    )

    const minuteElement = wrapper.find('input#date-minute')
    expect((minuteElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getUTCMinutes().toString()
    )

    const secondElement = wrapper.find('input#date-second')
    expect((secondElement.element as HTMLInputElement).value).toBe(
      expectedInitialDateValue.getUTCSeconds().toString()
    )
  })

  it('emits value if required when mounted', async () => {
    const wrapper = mount(DateComp, { props: { label: label, required: true } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[0][0]).toEqual(expectedInitial)
    }
  })

  it('emits value if required when mounted with time', async () => {
    vi.setSystemTime(referenceDateTime)
    const wrapper = mount(DateComp, { props: { label: label, required: true, showTime: true } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDateTime: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDateTime).toBeTruthy()
    if (emittedDateTime) {
      expect(emittedDateTime[0][0]).toEqual(expectedInitialTime)
    }
  })

  it('does not emit value when mounted if not initially selected', async () => {
    const wrapper = mount(DateComp, { props: { label: label } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate).not.toBeTruthy()
  })

  it('emits value when year is updated', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(3, 0, 0, 0)
    expectedUpdatedDateValue.setFullYear(expectedUpdatedDateValue.getFullYear() - 1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('T')[0]
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: { js: expectedUpdatedDateValue, iso: expectedUpdatedDateIsoValue, precision: 'day' },
    }

    const wrapper = mount(DateComp, { props: { label: label, required: true } }) // required set to ensure selected

    await wrapper.vm.$nextTick() // wait for watcher to fire

    // initial value

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[0][0]).toEqual(expectedInitial)
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

    if (emittedDate) {
      expect(emittedDate[2][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at year precision', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(3, 0, 0, 0)
    expectedUpdatedDateValue.setMonth(0)
    expectedUpdatedDateValue.setDate(1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('-')[0]
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: { js: expectedUpdatedDateValue, iso: expectedUpdatedDateIsoValue, precision: 'year' },
    }

    const wrapper = mount(DateComp, { props: { label: label, required: true } }) // required set to ensure selected

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')

    // only need to set the month to unknown as we don't allow day to be set without month
    const inputElement = wrapper.find('input#date-month')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[2][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at month precision', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(3, 0, 0, 0)
    expectedUpdatedDateValue.setDate(1)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue
      .toISOString()
      .split('-')
      .slice(0, 2)
      .join('-')
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: {
        js: expectedUpdatedDateValue,
        iso: expectedUpdatedDateIsoValue,
        precision: 'month',
      },
    }

    const wrapper = mount(DateComp, { props: { label: label, required: true } }) // required set to ensure selected

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')

    const inputElement = wrapper.find('input#date-day')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[2][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at day precision', async () => {
    const expectedUpdatedDateValue = new Date()
    expectedUpdatedDateValue.setHours(3, 0, 0, 0)
    const expectedUpdatedDateIsoValue = expectedUpdatedDateValue.toISOString().split('T')[0]
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: {
        js: expectedUpdatedDateValue,
        iso: expectedUpdatedDateIsoValue,
        precision: 'day',
      },
    }

    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')

    const inputElement = wrapper.find('input#date-hour')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[1][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at hour precision', async () => {
    vi.setSystemTime(referenceDateTime)
    const expectedUpdatedDateTimeValue = new Date()
    expectedUpdatedDateTimeValue.setUTCHours(14, 0, 0, 0)
    const expectedUpdatedDateTimeIsoValue = `${expectedUpdatedDateTimeValue.toISOString().split('T')[0]}T14+00:00`
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: {
        js: expectedUpdatedDateTimeValue,
        iso: expectedUpdatedDateTimeIsoValue,
        precision: 'day', // precision is only externally reported to a max precision of day
      },
    }

    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')

    const inputElement = wrapper.find('input#date-minute')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[1][0]).toEqual(expectedUpdated)
    }
  })

  it('computes correct date at minute precision', async () => {
    vi.setSystemTime(referenceDateTime)
    const expectedUpdatedDateTimeValue = new Date()
    expectedUpdatedDateTimeValue.setUTCMinutes(35, 0, 0)
    const expectedUpdatedDateTimeIsoValue = `${expectedUpdatedDateTimeValue.toISOString().split('T')[0]}T14:35+00:00`
    const expectedUpdated: DateImpreciseLabelled = {
      label: label,
      date: {
        js: expectedUpdatedDateTimeValue,
        iso: expectedUpdatedDateTimeIsoValue,
        precision: 'day', // precision is only externally reported to a max precision of day
      },
    }

    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')

    const inputElement = wrapper.find('input#date-second')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    await wrapper.vm.$nextTick()

    // updated value
    expect(emittedDate).toBeTruthy()
    if (emittedDate) {
      expect(emittedDate[1][0]).toEqual(expectedUpdated)
    }
  })

  it('disables higher precision inputs at year precision', async () => {
    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const inputElement = wrapper.find('input#date-month')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    expect(wrapper.find('input#date-day').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-hour').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-minute').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-second').attributes().disabled).toBe('')
  })

  it('disables higher precision inputs at month precision', async () => {
    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const inputElement = wrapper.find('input#date-day')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    expect(wrapper.find('input#date-hour').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-minute').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-second').attributes().disabled).toBe('')
  })

  it('disables higher precision inputs at day precision', async () => {
    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const inputElement = wrapper.find('input#date-hour')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    expect(wrapper.find('input#date-minute').attributes().disabled).toBe('')
    expect(wrapper.find('input#date-second').attributes().disabled).toBe('')
  })

  it('disables higher precision inputs at hour precision', async () => {
    const wrapper = mount(DateComp, {
      props: {
        label: label, // required set to ensure selected
        required: true,
        showTime: true,
      },
    })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const inputElement = wrapper.find('input#date-minute')
    await inputElement.setValue(impreciseValue)
    expect((inputElement.element as HTMLInputElement).value).toBe(impreciseValue)

    expect(wrapper.find('input#date-second').attributes().disabled).toBe('')
  })

  it('can be selected', async () => {
    const wrapper = mount(DateComp, { props: { label: label } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate).not.toBeTruthy()

    await wrapper.find(`input#date-${label}-selection`).setValue()

    const emittedDate2: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate2).toBeTruthy()
    if (emittedDate2) {
      expect(emittedDate2[0][0]).toEqual(expectedInitial)
    }
  })

  it('can be deselected', async () => {
    const wrapper = mount(DateComp, { props: { label: label } })

    await wrapper.vm.$nextTick() // wait for watcher to fire

    const emittedDate: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate).not.toBeTruthy()

    // select
    await wrapper.find(`input#date-${label}-selection`).setValue()
    const emittedDate2: unknown[][] | undefined = wrapper.emitted('add:date')
    expect(emittedDate2).toBeTruthy()
    if (emittedDate2) {
      expect(emittedDate2[0][0]).toEqual(expectedInitial)
    }

    // deselect
    await wrapper.find(`input#date-${label}-selection`).setValue(false)
    const emittedDate3: unknown[][] | undefined = wrapper.emitted('remove:date')
    expect(emittedDate3).toBeTruthy()
    if (emittedDate3) {
      expect(emittedDate3[0][0]).toEqual(expectedInitial)
    }
  })

  afterEach(() => {
    // Restores time
    vi.useRealTimers()
  })
})
