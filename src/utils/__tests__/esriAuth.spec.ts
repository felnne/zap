import { describe, it, expect } from 'vitest'

import type { EsriToken } from '@/types/app'
import { getSignInUrl, detectCallbackUrl, parseCallbackUrl } from '@/utils/esriAuth'
import { getSetting } from '@/utils/data'

describe('getSignInUrl', () => {
  it('returns login URL', () => {
    const redirectUri = window.location.origin
    const clientId = getSetting('agol_app_client_id')

    const signInUrl = getSignInUrl()
    expect(signInUrl).toContain(`client_id=${clientId}`)
    expect(signInUrl).toContain(`redirect_uri=${redirectUri}`)
  })
})

describe('detectCallbackUrl', () => {
  it('correct detects AGOL callback URL', () => {
    const hash = '#access_token=Fjp...zLo&expires_in=1123200&username=felnne_BAS&ssl=true'
    expect(detectCallbackUrl(hash)).toBeTruthy()
  })

  it('correctly detects non-AGOL callback URL', () => {
    const hash = '#access_token=xxx'
    expect(detectCallbackUrl(hash)).not.toBeTruthy()
  })
})

describe('parseCallbackUrl', () => {
  it('parses callback url', () => {
    const hash = '#access_token=Fjp...zLo&expires_in=1123200&username=conwat_BAS&ssl=true'
    const refTimestamp = 1706785451000 // 2024-02-01T11:04:11
    const expectedToken: EsriToken = {
      accessToken: 'Fjp...zLo',
      expiresIn: 1123200, // 13 days
      expiresAt: new Date(1707908651000), // 2024-02-14T11:04:11
      username: 'conwat_BAS',
    }

    const token = parseCallbackUrl(hash, refTimestamp)
    expect(token).toEqual(expectedToken)
  })

  it('throws error if no access_token', () => {
    const hash = '#expires_in=1209600&username=felnne_BAS&ssl=true'
    expect(() => parseCallbackUrl(hash)).toThrow('No access_token parameter in AGOL callback URL.')
  })

  it('throws error if no expires_in', () => {
    const hash = '#access_token=Fjp...zLo&username=felnne_BAS&ssl=true'
    expect(() => parseCallbackUrl(hash)).toThrow('No expires_in parameter in AGOL callback URL.')
  })

  it('throws error if no username', () => {
    const hash = '#access_token=Fjp...zLo&expires_in=1209600&ssl=true'
    expect(() => parseCallbackUrl(hash)).toThrow('No username parameter in AGOL callback URL.')
  })
})
