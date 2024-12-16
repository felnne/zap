import type { Projection } from '@/types/app'
import type { Extent, GeographicExtent, TemporalExtent, ReferenceSystemInfo } from '@/types/iso'

export const createExtent = (
  identifier: string,
  geographic: GeographicExtent,
  temporal?: TemporalExtent
): Extent => {
  /*
   * Create an (identified) ISO 19115 spatio-temporal extent with geographic and optional temporal components
   *
   * The BAS Metadata Library requires extents to be identified via an ID, with at least a 'bounding' extent.
   */
  const extent: Extent = {
    identifier: identifier,
    geographic: geographic,
  }
  if (temporal) {
    extent.temporal = temporal
  }
  return extent
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
