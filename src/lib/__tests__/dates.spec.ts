import { describe, it, expect } from 'vitest'

import { getImpreciseDate } from '@/lib/dates'

describe('getImpreciseDate', () => {
  it('handles year (least) precision correctly', () => {
    const year = 2014

    const expectedDate = new Date(year, 0, 1)
    expectedDate.setHours(3, 0, 0, 0)

    expect(getImpreciseDate(year)).toStrictEqual({
      js: expectedDate,
      iso: '2014',
      precision: 'year',
    })
  })

  it('handles month precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March

    const expectedDate = new Date(year, monthIndex, 1)
    expectedDate.setHours(3, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03',
      precision: 'month',
    })
  })

  it('handles day precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March
    const day = 20 // 20th

    const expectedDate = new Date(year, monthIndex, day)
    expectedDate.setHours(3, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03-20',
      precision: 'day',
    })
  })

  it('handles hour precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March
    const day = 20 // 20th
    const hour = 14 // 14:--

    const expectedDate = new Date(year, monthIndex, day, hour)
    expectedDate.setMinutes(0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day, hour)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03-20T14+00:00',
      precision: 'day',
    })
  })

  it('handles minute precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March
    const day = 20 // 20th
    const hour = 14 // 14:--
    const minute = 35 // 14:35

    const expectedDate = new Date(year, monthIndex, day, hour, minute)
    expectedDate.setSeconds(0, 0)

    expect(getImpreciseDate(year, monthIndex, day, hour, minute)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03-20T14:35+00:00',
      precision: 'day',
    })
  })

  it('handles second (most) precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March
    const day = 20 // 20th
    const hour = 14 // 14:--
    const minute = 35 // 14:35
    const second = 59 // 14:35:59

    const expectedDate = new Date(year, monthIndex, day, hour, minute, second)
    expectedDate.setMilliseconds(0)

    expect(getImpreciseDate(year, monthIndex, day, hour, minute, second)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03-20T14:35:59+00:00',
      precision: 'day',
    })
  })

  it('handles date with month precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = -1 // Unknown

    const expectedDate = new Date(year, monthIndex, 1)
    expectedDate.setHours(3, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01',
      precision: 'month',
    })
  })

  it('handles date with day precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = 1 // 1st

    const expectedDate = new Date(year, monthIndex, day)
    expectedDate.setHours(3, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01-01',
      precision: 'day',
    })
  })

  it('handles date with hour precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = 1 // 1st
    const hour = 3 // 03:00

    const expectedDate = new Date(year, monthIndex, day, hour)
    expectedDate.setMinutes(0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day, hour)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01-01T03+00:00',
      precision: 'day',
    })
  })

  it('handles date with minute precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = 1 // 1st
    const hour = 3 // 03:--
    const minute = 0 // 03:00

    const expectedDate = new Date(year, monthIndex, day, hour, minute)
    expectedDate.setSeconds(0, 0)

    expect(getImpreciseDate(year, monthIndex, day, hour, minute)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01-01T03:00+00:00',
      precision: 'day',
    })
  })

  it('handles date with minute precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = 1 // 1st
    const hour = 3 // 03:--
    const minute = 0 // 03:00
    const second = 0 // 03:00:00

    const expectedDate = new Date(year, monthIndex, day, hour, minute, second)
    expectedDate.setMilliseconds(0)

    expect(getImpreciseDate(year, monthIndex, day, hour, minute, second)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01-01T03:00:00+00:00',
      precision: 'day',
    })
  })
})
