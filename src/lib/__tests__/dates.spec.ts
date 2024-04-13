import { describe, it, expect } from 'vitest'

import { getImpreciseDate } from '@/lib/dates'

describe('getImpreciseDate', () => {
  it('handles year (least) precision correctly', () => {
    const year = 2014

    const expectedDate = new Date(year, 0, 1)
    expectedDate.setHours(0, 0, 0, 0)

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
    expectedDate.setHours(0, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03',
      precision: 'month',
    })
  })

  it('handles day (most) precision correctly', () => {
    const year = 2014
    const monthIndex = 2 // March
    const day = 20 // 20th

    const expectedDate = new Date(year, monthIndex, day)
    expectedDate.setHours(0, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-03-20',
      precision: 'day',
    })
  })

  it('handles date with month precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = -1 // Unknown

    const expectedDate = new Date(year, monthIndex, 1)
    expectedDate.setHours(0, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01',
      precision: 'month',
    })
  })

  it('handles date with day (most) precision that matches defaults correctly', () => {
    const year = 2014
    const monthIndex = 0 // January
    const day = 1 // 1st

    const expectedDate = new Date(year, monthIndex, day)
    expectedDate.setHours(0, 0, 0, 0)

    expect(getImpreciseDate(year, monthIndex, day)).toStrictEqual({
      js: expectedDate,
      iso: '2014-01-01',
      precision: 'day',
    })
  })
})
