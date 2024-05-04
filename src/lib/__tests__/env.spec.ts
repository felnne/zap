import { describe, it, expect } from 'vitest'

import { AppEnvironmentLabel } from '@/types/enum'
import { getAppEnvironment, getAppBorderClasses } from '@/lib/env'

describe('getAppEnvironment', () => {
  it('shows the correct label when in local development', () => {
    const path = ''
    expect(getAppEnvironment(path).label).toBe(AppEnvironmentLabel.LocalDevelopment)
  })

  it('shows the correct label when in a review app', () => {
    const path = '/review-foo'
    expect(getAppEnvironment(path).label).toBe(AppEnvironmentLabel.ReviewApp)
  })

  it('shows the correct label when in integration', () => {
    const path = '/integration/'
    expect(getAppEnvironment(path).label).toBe(AppEnvironmentLabel.Integration)
  })

  it('shows the correct label when in production', () => {
    const path = '/prod/'
    expect(getAppEnvironment(path).label).toBe(AppEnvironmentLabel.Production)
  })

  // can't test commit as it relies on an environment variable set in CI

  // can't test build time as it relies on an environment variable set in CI
})

describe('getAppBorderClasses', () => {
  it('returns the correct classes for local development', () => {
    const env = { label: AppEnvironmentLabel.LocalDevelopment }
    expect(getAppBorderClasses(env)).toEqual(['border-black', 'dark:border-white'])
  })

  // no need to test all combinations
})
