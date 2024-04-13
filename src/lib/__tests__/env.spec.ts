import { describe, it, expect } from 'vitest'

import { getAppEnvironment } from '@/lib/env'

describe('getAppEnvironment', () => {
  it('shows at least the build mode', () => {
    expect(getAppEnvironment().mode).toBeTruthy()
  })
})
