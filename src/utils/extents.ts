import type { Projection, WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

export const createExtent = (wke: WellKnownExtent): Extent => {
  return {
    geographic: wke.extent.geographic,
  }
}

export const createProjection = (projection: Projection): ReferenceSystemInfo => {
  return {
    authority: projection.authority,
    code: projection.code,
    version: projection.version,
  }
}
