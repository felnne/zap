import { afterAll, afterEach, describe, it, expect } from 'vitest'
import MatchMediaMock from 'vitest-matchmedia-mock'

import { get2dBasemap } from '@/lib/esri'

describe('getBasemap', () => {
  const matchMediaMock = new MatchMediaMock()
  const light2d = 'gray-vector'
  const dark2d = 'dark-gray-vector'

  it('returns dark choice for prefers dark 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)')
    expect(get2dBasemap()).toBe(dark2d)
  })

  it('returns light choice for prefers light 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: light)')
    expect(get2dBasemap()).toBe(light2d)
  })

  it('returns light choice for no-preference 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: no-preference)')
    expect(get2dBasemap()).toBe(light2d)
  })

  afterEach(() => {
    matchMediaMock.clear()
  })

  afterAll(() => {
    matchMediaMock.destroy()
  })
})
