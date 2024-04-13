import type { AccessPermission, AccessRestriction, Licence } from '@/types/app'
import type { Constraint } from '@/types/iso'

export const createAccessConstraint = (restriction: AccessRestriction): Constraint => {
  /*
   * Create an ISO 19115 access constraint from an application restriction object
   *
   * Application restriction objects are a superset of an ISO constraint, and need serialising within the free text
   * properties these support. These serialised properties are bespoke to the BAS metadata ecosystem but when
   * serialised are valid (if unusual) string values and should be ignored by other tools.
   *
   * Serialised permissions are stored as a URL fragment to avoid being shown to users in other catalogues. Whilst this
   * fragment won't work, it is a valid url string.
   */
  return {
    type: 'access',
    restriction_code: restriction.restriction ?? '',
    statement: restriction.label ?? '',
    href: `#${encodeURIComponent(JSON.stringify(restriction.permissions ?? []))}`,
  }
}

export const createUsageConstraint = (licence: Licence): Constraint => {
  /*
   * Create an ISO 19115 usage constraint from an application licence object
   *
   * App licence objects are a super-set of the ISO 19115 usage constraint. This method returns the relevant properties
   * supported by the ISO type.
   */
  return {
    type: 'usage',
    restriction_code: 'license',
    statement: licence.statement,
    href: licence.url,
  }
}

export const decodeAccessConstraintPermissions = (permissions: string): AccessPermission[] => {
  /*
   * Parse bespoke permissions information from an ISO 19115 access constraint
   *
   * Permissions are serialised as a URL fragment, the leading hash therefore needs removed before decoding.
   *
   * Permissions are serialised properties bespoke to the BAS metadata ecosystem and map to an application specific type.
   */
  // remove leading URL fragment
  permissions = permissions.replace(/^#/, '')
  return JSON.parse(decodeURIComponent(permissions))
}
