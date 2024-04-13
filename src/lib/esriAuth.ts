import type { EsriToken } from '@/types/app'
import { getSetting } from '@/lib/data'

export const getSignInUrl = (): string => {
  /*
   * Generate ArcGIS Online OAuth authorization url
   *
   * The redirectUri is urlEncoded and needs to be registered within the app in ArcGIS Online developer console.
   *
   * The expiration parameter uses an unusual 13 days (measured in minutes, as per Esri spec) so that we can more easily
   * detect it later (and not confuse it with OAuth callbacks from other services).
   *
   *
   * Example URL (where redirect URI is https://example.com/foo):
   * "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=abc123&response_type=token&expiration=18720&redirect_uri=https%3A%2F%2Fexample.com%2Ffoo"
   */
  const clientId = getSetting('agol_app_client_id')
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname)
  const expiration = 18720 // 13 days, parameter is in minutes

  return `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${clientId}&response_type=token&expiration=${expiration}&redirect_uri=${redirectUri}`
}

export const detectCallbackUrl = (callback: string): boolean => {
  /*
   * Determine whether a callback URL relates to ArcGIS Online
   *
   * Examines characteristics of the URL that when combined make a callback highly likely to relate to ArcGIS Online:
   * These are:
   * - a `ssl=true` parameter
   * - an `expires_in=1123200` parameter (13 days, in seconds), a custom duration to give a stronger indicator
   *
   * Whilst not perfect or deity-proof, this is a good enough heuristic for our purposes.
   *
   * Returns a true or false value.
   */
  return callback.includes('ssl=true') && callback.includes('expires_in=1123200')
}

export const parseCallbackUrl = (callback: string, _refTs: number | null = null): EsriToken => {
  /*
   * Parses a callback URL from ArcGIS Online into an app specific EsriToken object
   *
   * The callback parameter should be the hash fragment of the URL given by `window.location.hash`.
   *
   * The access_token, expires_in and username parameters are required and extracted. Any missing values will throw an
   * error. The ssl parameter is ignored.
   *
   * A derived expiresAt property is calculated from a given date (now by default) and the duration from the callback.
   * To support testing, the reference point for the expiresAt property can be overridden (i.e. with a static value).
   *
   * Example:
   *
   * Where:
   * - `window.location.hash` is '#access_token=abc123&expires_in=1123200&username=conwat_BAS&ssl=true'
   * - `Date.now()` is 2024-01-08T12:00:00.000Z
   *
   * Gives:
   * {
   *  accessToken: 'abc123',
   *  expiresIn: 1123200,
   *  expiresAt: 2024-01-21T12:00:00.000Z,
   *  username: 'conwat_BAS'
   * }
   */
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
