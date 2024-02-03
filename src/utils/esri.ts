import { getSetting } from './data'

export const get2dBasemap = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return getSetting('app_extents_2d_basemap_dark')
  }

  return getSetting('app_extents_2d_basemap_light')
}

export const get3dBasemap = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return getSetting('app_extents_3d_basemap_dark')
  }

  return getSetting('app_extents_3d_basemap_light')
}
