import type { DateImprecise } from '@/types/app'

export const getImpreciseDate = (
  year: number,
  monthIndex: number = -1,
  day: number = -1
): DateImprecise => {
  /*
   * Basic implementation of a date with optional imprecision.
   *
   * Supports precision from day (most) to year (least).
   * Time is not yet supported and fixed at 03:00:00.000 to avoid timezone issues when formatting as an ISO date.
   *
   * Returns an object with:
   * - a JS date (the month and day of which may be inaccurate)
   * - an ISO date string
   * - a precision label (either 'day', 'month' or 'year')
   *
   * Date are assumed to have the least precision (year), with month and day set to `-1` (unknown).
   * To increase precision, set a valid monthIndex (0-11) and optionally day (1-31) instead.
   *
   * When reading a imprecise date make sure to take account of the precision label.
   *
   * In:
   * getImpreciseDate(2014)
   * getImpreciseDate(2014, 2)
   * getImpreciseDate(2014, 2, 20)
   *
   * Out:
   * {js: date(2014, 0, 1), iso: '2014', precision: 'year'}
   * {js: date(2014, 2, 1), iso: '2014-03', precision: 'month'}
   * {js: date(2014, 2, 20), iso: '2014-03-20', precision: 'day'}
   */
  const value = new Date(Date.UTC(year, 0, 1, 3, 0, 0, 0)) // 1st of January, 03:00:00.000

  let precision = 'year'
  if (monthIndex > -1) {
    value.setMonth(monthIndex)
    precision = 'month'
  }
  if (monthIndex > -1 && day > -1) {
    value.setDate(day)
    precision = 'day'
  }

  const isoValue = getImpreciseIsoDate(value, precision)

  return { js: value, iso: isoValue, precision: precision }
}

const getImpreciseIsoDate = (date: Date, precision: string): string => {
  /*
   * Returns an ISO date string with the specified precision.
   *
   * Times are currently ignored (cropped).
   *
   * In:
   * Date(2014)
   * Date(2014, 2)
   * Date(2014, 2, 20)
   *
   * Out:
   * '2014'
   * '2014-03' (as JS months are 0-indexed)
   * '2014-03-20'
   */
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const day = date.getUTCDate().toString().padStart(2, '0')

  if (precision === 'year') {
    return `${year}`
  } else if (precision === 'month') {
    return `${year}-${month}`
  } else {
    return `${year}-${month}-${day}`
  }
}
