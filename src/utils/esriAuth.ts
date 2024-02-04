import type { EsriToken } from '@/types/app'
import { getSetting } from '@/utils/data'

export const getSignInUrl = (): string => {
  const clientId = getSetting('agol_app_client_id')
  // include custom expiration parameter to give more confidence when detecting the callback URL
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname)
  const expiration = 18720 // 13 days, parameter is in minutes

  return `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${clientId}&response_type=token&expiration=${expiration}&redirect_uri=${redirectUri}`
}

export const detectCallbackUrl = (callback: string): boolean => {
  // Look for constants in the URL hash (ssl parameter and fixed token duration of 13 days)
  // Only detects callbacks originating from `getSignInUrl()` which sets non-standard expiration.
  return callback.includes('ssl=true') && callback.includes('expires_in=1123200')
}

export const parseCallbackUrl = (callback: string, _refTs: number | null = null): EsriToken => {
  // to allow for testing
  const timestamp: number = _refTs || Date.now()

  // strip leading #
  if (callback.startsWith('#')) {
    callback = callback.substring(1)
  }

  const params = new URLSearchParams(callback)

  if (!params.has('access_token') || params.get('access_token') === null) {
    throw new Error('No access_token parameter in AGOL callback URL.')
  }
  const accessToken = params.get('access_token')

  if (!params.has('expires_in') || params.get('expires_in') === null) {
    throw new Error('No expires_in parameter in AGOL callback URL.')
  }
  const expiresIn = parseInt(params.get('expires_in')!)
  const expiresAt = new Date(timestamp + expiresIn * 1000)

  if (!params.has('username') || params.get('username') === null) {
    throw new Error('No username parameter in AGOL callback URL.')
  }
  const username = params.get('username')

  return {
    accessToken: accessToken!,
    expiresIn: expiresIn,
    expiresAt: expiresAt,
    username: username!,
  }
}
