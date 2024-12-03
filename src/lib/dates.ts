import type { DateImprecise } from '@/types/app'

export const getImpreciseDate = (
  year: number,
  monthIndex: number = -1,
  day: number = -1,
  hour: number = -1,
  minute: number = -1,
  second: number = -1
): DateImprecise => {
  /*
   * Basic implementation of a date(time) with optional imprecision.
   *
   * Supports precision from second (most) to year (least). Milliseconds are not supported.
   *
   * Returns an object with:
   * - a JS date (the month, day and time of which may be inaccurate)
   * - an ISO date(time) string
   * - a precision label (either 'day', 'month' or 'year')
   *
   * Dates are assumed to have the least precision (year), with month, day, hours, minutes and seconds set to `-1`
   * (unknown). To increase precision, set a valid monthIndex (0-11), day (1-31), hour (0-23), minute (0-59) and second
   * (0-59) as well.
   *
   * Where a time is specified, the UTC timezone is always used.
   *
   * When reading a imprecise date, make sure to take account of the precision label. Note that this only affects the
   * date rather than date time as its expected/supported for time elements to be optional. I.e. In Python a date object
   * must have a year, month and day but can have optional hour, minute and second.
   *
   * (note: an internal precision is used to construct the ISO date string, this is an implementation detail and not
   * exposed in returned data).
   *
   * In:
   * getImpreciseDate(2014)
   * getImpreciseDate(2014, 2)
   * getImpreciseDate(2014, 2, 20)
   * getImpreciseDate(2014, 2, 20, 14)
   * getImpreciseDate(2014, 2, 20, 14, 35)
   * getImpreciseDate(2014, 2, 20, 14, 35, 59)
   *
   * Out:
   * {js: date(2014, 0, 1), iso: '2014', precision: 'year'}
   * {js: date(2014, 2, 1), iso: '2014-03', precision: 'month'}
   * {js: date(2014, 2, 20), iso: '2014-03-20', precision: 'day'}
   * {js: date(2014, 2, 20, 14), iso: '2014-03-20T14+00:00', precision: 'day'}
   * {js: date(2014, 2, 20, 14, 35), iso: '2014-03-20T14:35+00:00', precision: 'day'}
   * {js: date(2014, 2, 20, 14, 35, 59), iso: '2014-03-20T14:35:59+00:00', precision: 'day'}
   */
  const value = new Date(Date.UTC(year, 0, 1, 3, 0, 0, 0)) // 1st of January, 03:00:00.000
  let precision = 'year'
  let _precision = 'year'

  if (monthIndex > -1) {
    value.setMonth(monthIndex)
    precision = 'month'
    _precision = 'month'
  }
  if (monthIndex > -1 && day > -1) {
    value.setDate(day)
    precision = 'day'
    _precision = 'day'
  }
  if (monthIndex > -1 && day > -1 && hour > -1) {
    value.setUTCHours(hour)
    precision = 'day'
    _precision = 'hour'
  }
  if (monthIndex > -1 && day > -1 && hour > -1 && minute > -1) {
    value.setUTCMinutes(minute)
    precision = 'day'
    _precision = 'minute'
  }
  if (monthIndex > -1 && day > -1 && hour > -1 && minute > -1 && second > -1) {
    value.setUTCSeconds(second)
    precision = 'day'
    _precision = 'second'
  }

  const isoValue = getImpreciseIsoDate(value, _precision)

  return { js: value, iso: isoValue, precision: precision }
}

const getImpreciseIsoDate = (date: Date, precision: string): string => {
  /*
   * Returns an ISO date(time) string with the specified precision.
   *
   * In:
   * Date(2014)
   * Date(2014, 2)
   * Date(2014, 2, 20)
   * Date(2014, 2, 20, 14)
   * Date(2014, 2, 20, 14, 35)
   * Date(2014, 2, 20, 14, 35, 59)
   *
   * Out:
   * '2014'
   * '2014-03' (as JS months are 0-indexed)
   * '2014-03-20'
   * '2014-03-20T14+00:00'
   * '2014-03-20T14:35+00:00'
   * '2014-03-20T14:35:59+00:00'
   */
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // Months are zero-indexed
  const day = date.getUTCDate().toString().padStart(2, '0')
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')

  if (precision === 'year') {
    return `${year}`
  } else if (precision === 'month') {
    return `${year}-${month}`
  } else if (precision === 'day') {
    return `${year}-${month}-${day}`
  } else if (precision === 'hour') {
    return `${year}-${month}-${day}T${hours}+00:00`
  } else if (precision === 'minute') {
    return `${year}-${month}-${day}T${hours}:${minutes}+00:00`
  } else {
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`
  }
}
