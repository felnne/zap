import type { Projection, WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

export const createExtent = (wke: WellKnownExtent): Extent => {
  /*
   * Convert an application specific Well Known Extent into an ISO 19115 geographic extent
   *
   * As the WKE is a wrapper around an ISO 19115 geographic extent, this simply returns that subset.
   */
  return {
    geographic: wke.extent.geographic,
  }
}

export const createProjection = (projection: Projection): ReferenceSystemInfo => {
  /*
   * Convert an application specific Coordinate Reference System / Projection into an ISO 19115 reference system info
   *
   * As app projection object is a super-set of the ISO 19115 reference system info, this returns the relevant
   * properties of the ISO type.
   */
  return {
    authority: projection.authority,
    code: projection.code,
    version: projection.version,
  }
}
