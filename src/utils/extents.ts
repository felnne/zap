import type { Projection, WellKnownExtent } from '@/types/app'
import type { Extent, ReferenceSystemInfo } from '@/types/iso'

export const createExtent = (wke: WellKnownExtent, identifier: string): Extent => {
  /*
   * Convert an application specific Well Known Extent into an (identified) ISO 19115 geographic extent
   *
   * The BAS Metadata Library requires extents to be identified via an ID, with at least a 'bounding' extent.
   * As the WKE is a wrapper around an ISO 19115 geographic extent, that subset is returned without change.
   */
  return {
    identifier: identifier,
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
