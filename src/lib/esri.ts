import { getSetting } from '@/lib/data'

export const get2dBasemap = (): string => {
  /*
   * Selects a 2D basemap based the user's colour preference
   *
   * The basemaps to use are defined in the app settings file.
   */
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return getSetting('app_extents_2d_basemap_dark')
  }

  return getSetting('app_extents_2d_basemap_light')
}

export const get3dBasemap = (): string => {
  /*
   * Selects a 3D basemap based the user's colour preference
   *
   * The basemaps to use are defined in the app settings file.
   */
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return getSetting('app_extents_3d_basemap_dark')
  }

  return getSetting('app_extents_3d_basemap_light')
}
