import { ResourceType } from '@/types/enum'
import type { Licence } from '@/types/app'

export const doiPossible = (resourceType: ResourceType, licence: Licence): boolean => {
  /*
   * Determine whether a DOI is possible based on the resource type and licence.
   *
   * Based on whether the PDC can be a publisher, as they are currently the only route in BAS to a DOI.
   * The PDC only publish datasets with an open licence so this is used as a crude check.
   */
  if (resourceType === ResourceType.Dataset && licence.open) {
    return true
  }
  return false
}
