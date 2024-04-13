import { afterAll, afterEach, describe, it, expect } from 'vitest'
import MatchMediaMock from 'vitest-matchmedia-mock'

import { get2dBasemap, get3dBasemap } from '@/lib/esri'

describe('getBasemap', () => {
  const matchMediaMock = new MatchMediaMock()
  const light2d = 'gray-vector'
  const dark2d = 'dark-gray-vector'
  const light3d = 'navigation-3d'
  const dark3d = 'navigation-dark-3d'

  it('returns dark choice for prefers dark 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)')
    expect(get2dBasemap()).toBe(dark2d)
  })

  it('returns dark choice for prefers dark 3d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)')
    expect(get3dBasemap()).toBe(dark3d)
  })

  it('returns light choice for prefers light 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: light)')
    expect(get2dBasemap()).toBe(light2d)
  })

  it('returns light choice for prefers light 3d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: light)')
    expect(get3dBasemap()).toBe(light3d)
  })

  it('returns light choice for no-preference 2d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: no-preference)')
    expect(get2dBasemap()).toBe(light2d)
  })

  it('returns light choice for no-preference 3d', () => {
    matchMediaMock.useMediaQuery('(prefers-color-scheme: no-preference)')
    expect(get3dBasemap()).toBe(light3d)
  })

  afterEach(() => {
    matchMediaMock.clear()
  })

  afterAll(() => {
    matchMediaMock.destroy()
  })
})
