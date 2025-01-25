import type { PhysicalDimensions, SupplementalInformation } from '@/types/app'

export const createSupplementalInfo = (dimensions?: PhysicalDimensions): string | undefined => {
  /* Encode various properties within an ISO 19115-1 supplemental information element as a JSON string. */
  if (!dimensions) {
    return undefined
  }

  const data: SupplementalInformation = {
    physical_size_width_mm: dimensions.width,
    physical_size_height_mm: dimensions.height,
  }

  return JSON.stringify(data)
}
